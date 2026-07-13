from fastapi import HTTPException, status


class AppException(HTTPException):
    def __init__(self, status_code: int, detail: str):
        super().__init__(status_code=status_code, detail=detail)


class NotFoundException(AppException):
    def __init__(self, detail: str = "Recurso no encontrado"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


class UnauthorizedException(AppException):
    def __init__(self, detail: str = "Credenciales invalidas"):
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)


class ForbiddenException(AppException):
    def __init__(self, detail: str = "Permisos insuficientes"):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)


class ConflictException(AppException):
    def __init__(self, detail: str = "El recurso ya existe"):
        super().__init__(status_code=status.HTTP_409_CONFLICT, detail=detail)


class BadRequestException(AppException):
    def __init__(self, detail: str = "Solicitud invalida"):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)


class IngestionException(AppException):
    def __init__(self, detail: str = "Error durante la ingesta del documento"):
        super().__init__(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=detail)
