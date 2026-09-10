from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.responses import StreamingResponse
from routes.auth import get_current_user
from motor.motor_asyncio import AsyncIOMotorClient
from services.email_service import email_service
import os
import io
import csv
import logging
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/admin", tags=["admin"])

mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'origenes_db')]
contacts_collection = db.contacts


@router.get("/contacts")
async def list_contacts(
    status_filter: str = Query(None),
    search: str = Query(None),
    limit: int = Query(50, ge=1, le=200),
    skip: int = Query(0, ge=0),
    user: dict = Depends(get_current_user),
):
    """List all contacts with filtering and search."""
    query = {}
    if status_filter and status_filter != "all":
        query["status"] = status_filter
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
            {"department": {"$regex": search, "$options": "i"}},
            {"culture": {"$regex": search, "$options": "i"}},
        ]

    total = await contacts_collection.count_documents(query)
    contacts = await contacts_collection.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(length=limit)

    return {"contacts": contacts, "total": total, "limit": limit, "skip": skip}


@router.patch("/contacts/{contact_id}/status")
async def update_status(
    contact_id: str,
    new_status: str = Query(...),
    user: dict = Depends(get_current_user),
):
    """Update contact status and send notification email."""
    valid = ["pending", "contacted", "closed"]
    if new_status not in valid:
        raise HTTPException(status_code=400, detail=f"Estado inválido. Debe ser: {', '.join(valid)}")

    result = await contacts_collection.update_one(
        {"id": contact_id},
        {"$set": {"status": new_status, "updated_at": datetime.now(timezone.utc).isoformat(), "updated_by": user.get("email", "")}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Consulta no encontrada")

    if new_status in ("contacted", "closed"):
        contact = await contacts_collection.find_one({"id": contact_id}, {"_id": 0})
        if contact:
            try:
                email_service.send_status_update(contact, new_status)
            except Exception as e:
                logger.warning(f"Status email failed: {e}")

    return {"message": "Estado actualizado", "status": new_status}


@router.delete("/contacts/{contact_id}")
async def delete_contact(
    contact_id: str,
    user: dict = Depends(get_current_user),
):
    """Delete a contact."""
    result = await contacts_collection.delete_one({"id": contact_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Consulta no encontrada")
    return {"message": "Consulta eliminada"}


@router.get("/stats")
async def get_stats(user: dict = Depends(get_current_user)):
    """Get dashboard statistics."""
    total = await contacts_collection.count_documents({})
    pending = await contacts_collection.count_documents({"status": "pending"})
    contacted = await contacts_collection.count_documents({"status": "contacted"})
    closed = await contacts_collection.count_documents({"status": "closed"})

    recent = await contacts_collection.find({}, {"_id": 0}).sort("created_at", -1).limit(5).to_list(length=5)

    return {
        "total": total,
        "pending": pending,
        "contacted": contacted,
        "closed": closed,
        "recent": recent,
    }


@router.get("/contacts/export/csv")
async def export_contacts_csv(
    status_filter: str = Query(None),
    user: dict = Depends(get_current_user),
):
    """Export contacts as CSV file."""
    query = {}
    if status_filter and status_filter != "all":
        query["status"] = status_filter

    contacts = await contacts_collection.find(query, {"_id": 0}).sort("created_at", -1).to_list(length=10000)

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Nombre", "Email", "Teléfono", "Departamento", "Municipio", "Cultivo", "Hectáreas", "CE Suelo (dS/m)", "pH Suelo", "Síntomas / Problemática", "Estado", "Fecha"])

    for c in contacts:
        writer.writerow([
            c.get("id", ""),
            c.get("name", ""),
            c.get("email", ""),
            c.get("phone", ""),
            c.get("department", ""),
            c.get("municipality", ""),
            c.get("culture", ""),
            c.get("hectares", ""),
            c.get("soil_ec", ""),
            c.get("soil_ph", ""),
            c.get("message", ""),
            c.get("status", ""),
            str(c.get("created_at", ""))[:19],
        ])

    output.seek(0)
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M")
    filename = f"origenes_consultas_{timestamp}.csv"

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )
