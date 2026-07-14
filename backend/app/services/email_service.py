import logging
from html import escape

import resend

from app.core.config import settings

logger = logging.getLogger(__name__)


class EmailService:
    @staticmethod
    def send_verification_email(
        *,
        recipient_email: str,
        recipient_name: str,
        verification_token: str,
    ) -> bool:
        verification_url = (
            f"{settings.FRONTEND_URL}/verify-email"
            f"?token={verification_token}"
        )

        if not settings.RESEND_API_KEY:
            logger.warning(
                "RESEND_API_KEY no configurada. "
                "Enlace de verificacion para %s: %s",
                recipient_email,
                verification_url,
            )
            return False

        resend.api_key = settings.RESEND_API_KEY

        safe_name = escape(recipient_name)
        safe_url = escape(verification_url, quote=True)

        html_content = f"""
        <!DOCTYPE html>
        <html lang="es">
          <body style="
            margin: 0;
            padding: 32px;
            background: #f5f7fa;
            font-family: Arial, sans-serif;
            color: #111827;
          ">
            <div style="
              max-width: 560px;
              margin: 0 auto;
              background: #ffffff;
              border: 1px solid #e5e7eb;
              border-radius: 20px;
              padding: 32px;
            ">
              <p style="
                color: #0369a1;
                font-size: 14px;
                font-weight: 700;
              ">
                StudyBuddy AI
              </p>

              <h1 style="
                margin: 16px 0;
                font-size: 28px;
                line-height: 1.2;
              ">
                Verifica tu correo
              </h1>

              <p style="
                color: #4b5563;
                line-height: 1.7;
              ">
                Hola {safe_name}, gracias por crear tu cuenta.
                Confirma tu dirección de correo para comenzar a usar
                la plataforma.
              </p>

              <a
                href="{safe_url}"
                style="
                  display: inline-block;
                  margin-top: 24px;
                  padding: 14px 22px;
                  border-radius: 12px;
                  background: #0369a1;
                  color: #ffffff;
                  text-decoration: none;
                  font-weight: 700;
                "
              >
                Verificar mi correo
              </a>

              <p style="
                margin-top: 28px;
                color: #6b7280;
                font-size: 13px;
                line-height: 1.6;
              ">
                Este enlace expirará en
                {settings.EMAIL_TOKEN_EXPIRE_HOURS} horas.
              </p>

              <p style="
                margin-top: 20px;
                color: #6b7280;
                font-size: 12px;
                word-break: break-all;
              ">
                Si el botón no funciona, copia este enlace:
                {safe_url}
              </p>
            </div>
          </body>
        </html>
        """

        try:
            resend.Emails.send(
                {
                    "from": settings.EMAIL_FROM,
                    "to": [recipient_email],
                    "subject": "Verifica tu cuenta de StudyBuddy AI",
                    "html": html_content,
                }
            )

            logger.info(
                "Correo de verificacion enviado a %s",
                recipient_email,
            )
            return True

        except Exception:
            logger.exception(
                "No se pudo enviar el correo a %s. "
                "Enlace de verificacion: %s",
                recipient_email,
                verification_url,
            )
            return False