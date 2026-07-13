import re


def is_strong_password(password: str) -> bool:
    has_upper = any(ch.isupper() for ch in password)
    has_digit = any(ch.isdigit() for ch in password)
    has_min_length = len(password) >= 8
    return has_upper and has_digit and has_min_length


def validate_slug(value: str) -> bool:
    return bool(re.match(r"^[a-z0-9-]+$", value))


def sanitize_filename(filename: str) -> str:
    filename = re.sub(r'[<>:"/\\|?*]', "_", filename)
    filename = filename.strip(". ")
    return filename[:255] if filename else "documento"
