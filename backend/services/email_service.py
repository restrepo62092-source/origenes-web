import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import logging

logger = logging.getLogger(__name__)


class EmailService:
    def __init__(self):
        self.smtp_host = "smtp.gmail.com"
        self.smtp_port = 587
        self.sender_email = os.environ.get('GMAIL_USER', 'gerencia@origeneskhachi.org')
        self.sender_password = os.environ.get('GMAIL_APP_PASSWORD', '')
        self.recipient_email = os.environ.get('NOTIFICATION_EMAIL', 'gerencia@origeneskhachi.org')

    def _build_header(self):
        return """
        <div style="background-color:#2d5016;padding:28px 32px;border-radius:12px 12px 0 0;">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td>
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;">ORÍGENES</h1>
              <p style="margin:4px 0 0;color:#d97706;font-size:13px;font-weight:600;">NUTRICIÓN Y PRECISIÓN</p>
            </td>
            <td align="right" style="color:#a7c4a0;font-size:11px;">Consultoría Agrícola<br/>de Precisión</td>
          </tr></table>
        </div>"""

    def _build_footer(self):
        return """
        <div style="background-color:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0;border-radius:0 0 12px 12px;">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td>
              <p style="margin:0;font-size:12px;color:#64748b;">gerencia@origeneskhachi.org</p>
              <p style="margin:2px 0 0;font-size:12px;color:#64748b;">+57 300 558 2757 / +57 310 321 2780</p>
            </td>
            <td align="right">
              <p style="margin:0;font-size:11px;color:#94a3b8;">Finca La Esperanza, Vda La Rambla</p>
              <p style="margin:2px 0 0;font-size:11px;color:#94a3b8;">San Antonio del Tequendama</p>
            </td>
          </tr></table>
          <p style="margin:16px 0 0;font-size:10px;color:#cbd5e1;text-align:center;">
            © 2026 ORÍGENES: Nutrición y Precisión. Todos los derechos reservados.
          </p>
        </div>"""

    def send_contact_notification(self, contact_data):
        """Send institutional notification for new contact inquiry."""
        try:
            if not self.sender_password:
                logger.warning("Gmail App Password not configured. Email skipped.")
                return False

            message = MIMEMultipart("alternative")
            message["Subject"] = f"[ORÍGENES] Auditoría Santuario-Cronos — {contact_data['name']}"
            message["From"] = f"ORÍGENES Consultoría <{self.sender_email}>"
            message["To"] = self.recipient_email

            def _row(label, value):
                if value in (None, ""):
                    return ""
                return f"""
                <tr>
                  <td style="padding:8px 12px;font-size:13px;color:#64748b;border-bottom:1px solid #f1f5f9;width:150px;">{label}</td>
                  <td style="padding:8px 12px;font-size:13px;color:#1e293b;border-bottom:1px solid #f1f5f9;font-weight:500;">{value}</td>
                </tr>"""

            hectares_row = (
                _row("Municipio", contact_data.get('municipality'))
                + _row("Hectáreas", contact_data.get('hectares'))
                + _row("CE del Suelo (dS/m)", contact_data.get('soil_ec'))
                + _row("pH del Suelo", contact_data.get('soil_ph'))
            )

            html = f"""
            <html><body style="margin:0;padding:0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#f1f5f9;">
              <div style="max-width:600px;margin:24px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
                {self._build_header()}
                <div style="padding:28px 32px;">
                  <div style="background:#fef3c7;border-left:4px solid #d97706;padding:12px 16px;border-radius:0 8px 8px 0;margin-bottom:24px;">
                    <p style="margin:0;font-size:14px;color:#92400e;font-weight:600;">Nueva solicitud de Auditoría Bio-Agronómica Santuario-Cronos</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#a16207;">ID: {contact_data.get('id', 'N/A')} · {str(contact_data.get('created_at', ''))[:19]}</p>
                  </div>

                  <h2 style="font-size:15px;color:#2d5016;margin:0 0 12px;text-transform:uppercase;letter-spacing:1px;">Datos del Productor / Empresa</h2>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
                    <tr>
                      <td style="padding:8px 12px;font-size:13px;color:#64748b;border-bottom:1px solid #f1f5f9;width:120px;">Nombre</td>
                      <td style="padding:8px 12px;font-size:13px;color:#1e293b;border-bottom:1px solid #f1f5f9;font-weight:600;">{contact_data['name']}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 12px;font-size:13px;color:#64748b;border-bottom:1px solid #f1f5f9;">Email</td>
                      <td style="padding:8px 12px;font-size:13px;border-bottom:1px solid #f1f5f9;"><a href="mailto:{contact_data['email']}" style="color:#2563eb;text-decoration:none;">{contact_data['email']}</a></td>
                    </tr>
                    <tr>
                      <td style="padding:8px 12px;font-size:13px;color:#64748b;border-bottom:1px solid #f1f5f9;">Teléfono</td>
                      <td style="padding:8px 12px;font-size:13px;color:#1e293b;border-bottom:1px solid #f1f5f9;">{contact_data['phone']}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 12px;font-size:13px;color:#64748b;border-bottom:1px solid #f1f5f9;">Departamento</td>
                      <td style="padding:8px 12px;font-size:13px;color:#1e293b;border-bottom:1px solid #f1f5f9;">{contact_data['department']}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 12px;font-size:13px;color:#64748b;border-bottom:1px solid #f1f5f9;">Cultivo</td>
                      <td style="padding:8px 12px;font-size:13px;color:#1e293b;border-bottom:1px solid #f1f5f9;">{contact_data['culture']}</td>
                    </tr>
                    {hectares_row}
                  </table>

                  <h2 style="font-size:15px;color:#2d5016;margin:24px 0 12px;text-transform:uppercase;letter-spacing:1px;">Síntomas / Problemática Observada en Campo</h2>
                  <div style="background:#f0fdf4;padding:16px;border-radius:8px;border-left:4px solid #2d5016;">
                    <p style="margin:0;font-size:14px;color:#1e293b;line-height:1.6;white-space:pre-wrap;">{contact_data['message']}</p>
                  </div>

                  <div style="margin-top:24px;text-align:center;">
                    <p style="font-size:12px;color:#94a3b8;">Estado: <strong style="color:#d97706;">Pendiente</strong> — Gestionar desde el Panel Administrativo</p>
                  </div>
                </div>
                {self._build_footer()}
              </div>
            </body></html>
            """

            message.attach(MIMEText(html, "html"))

            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password)
                server.send_message(message)

            logger.info(f"Email notification sent for: {contact_data['email']}")
            return True

        except Exception as e:
            logger.error(f"Email notification error: {str(e)}")
            return False

    def send_status_update(self, contact_data, new_status):
        """Send email to client when their inquiry status changes."""
        try:
            if not self.sender_password:
                logger.warning("Gmail App Password not configured. Status email skipped.")
                return False

            status_messages = {
                "contacted": ("Hemos recibido tu solicitud", "Nuestro equipo de consultores ha revisado tu solicitud y se pondrá en contacto contigo en las próximas 24-48 horas para coordinar una visita técnica."),
                "closed": ("Consulta finalizada", "Tu proceso de consultoría ha sido completado. Si necesitas asistencia adicional, no dudes en contactarnos nuevamente."),
            }

            if new_status not in status_messages:
                return False

            title, body = status_messages[new_status]
            client_email = contact_data.get('email', '')
            if not client_email:
                return False

            message = MIMEMultipart("alternative")
            message["Subject"] = f"[ORÍGENES] {title}"
            message["From"] = f"ORÍGENES Consultoría <{self.sender_email}>"
            message["To"] = client_email

            html = f"""
            <html><body style="margin:0;padding:0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#f1f5f9;">
              <div style="max-width:600px;margin:24px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
                {self._build_header()}
                <div style="padding:28px 32px;">
                  <p style="font-size:15px;color:#1e293b;margin:0 0 8px;">Estimado/a <strong>{contact_data.get('name', 'Cliente')}</strong>,</p>
                  <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 20px;">{body}</p>

                  <div style="background:#f0fdf4;padding:16px;border-radius:8px;text-align:center;margin:20px 0;">
                    <p style="margin:0;font-size:13px;color:#2d5016;">¿Necesitas comunicarte con nosotros?</p>
                    <p style="margin:8px 0 0;">
                      <a href="https://wa.me/573005582757" style="display:inline-block;background:#25D366;color:white;padding:10px 24px;border-radius:24px;text-decoration:none;font-size:13px;font-weight:600;">Escribir por WhatsApp</a>
                    </p>
                  </div>

                  <p style="font-size:13px;color:#94a3b8;margin:20px 0 0;">Referencia: {contact_data.get('id', 'N/A')}</p>
                </div>
                {self._build_footer()}
              </div>
            </body></html>
            """

            message.attach(MIMEText(html, "html"))

            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password)
                server.send_message(message)

            logger.info(f"Status update email sent to: {client_email}")
            return True

        except Exception as e:
            logger.error(f"Status update email error: {str(e)}")
            return False


email_service = EmailService()
