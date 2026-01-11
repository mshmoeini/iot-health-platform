from app.services.storage import Storage


def create_wristband(storage: Storage, wristband_id: int) -> dict:
    """
    Create wristband (business layer).

    لایه سرویس:
    فعلاً فقط پاس‌ترو است و منطق اضافه ندارد.
    """
    return storage.create_wristband(wristband_id)


def list_wristbands(storage: Storage) -> dict:
    """
    Return all wristbands (UI-ready).
    """
    return {"items": storage.list_wristbands()}


def list_available_wristbands(storage: Storage) -> dict:
    """
    Return available wristbands (no active assignment).
    """
    return {"items": storage.list_available_wristbands()}
