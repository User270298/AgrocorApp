from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from crud import  (create_vessel, create_cargo, get_vessel, get_cargo, create_catcher, get_catcher,
        create_vessel, create_cargo, get_vessel, get_cargo, get_pending_vessel, 
        get_pending_cargo, update_vessel_status, update_cargo_status)
from schemas import CatcherAddItem, VesselAddItem, CargoAddItem, CatcherItem
from database import get_db


router = APIRouter()


@router.get("/catcher")
def get_catcher_items(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    result=get_catcher(db, skip=skip, limit=limit)
    print('Result', result)
    return result


@router.post("/catcher", response_model=CatcherItem)
def create_catcher_endpoint(catcher: CatcherAddItem, db: Session = Depends(get_db)):
    print("Received data:", catcher)
    return create_catcher(db, catcher)


@router.get("/cargo")
def read_cargo(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return get_cargo(db, skip=skip, limit=limit)


@router.post("/cargo")
def add_cargo(cargo: CargoAddItem, db: Session = Depends(get_db)):
    print("Received data:", cargo) 
    return create_cargo(db=db, cargo=cargo)


@router.get("/vessel")
def read_vessel(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return get_vessel(db, skip=skip, limit=limit)


@router.post("/vessel")
def add_vessel(vessel: VesselAddItem, db: Session = Depends(get_db)):
    print("Received data:", vessel) 
    return create_vessel(db=db, vessel=vessel)







# router = APIRouter()

# # Получить предложения со статусом 'pending'
# @router.get("/pending/vessel")
# def get_pending_vessel_items(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
#     return get_pending_vessel(db, skip=skip, limit=limit)

# @router.get("/pending/cargo")
# def get_pending_cargo_items(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
#     return get_pending_cargo(db, skip=skip, limit=limit)

# # Подтвердить статус предложения (Vessel)
# @router.post("/vessel/approve/{id}")
# def approve_vessel(id: int, db: Session = Depends(get_db)):
#     return update_vessel_status(db, id, "approved")

# # Отклонить статус предложения (Vessel)
# @router.post("/vessel/reject/{id}")
# def reject_vessel(id: int, db: Session = Depends(get_db)):
#     return update_vessel_status(db, id, "cancel")

# # Подтвердить статус предложения (Cargo)
# @router.post("/cargo/approve/{id}")
# def approve_cargo(id: int, db: Session = Depends(get_db)):
#     return update_cargo_status(db, id, "approved")

# # Отклонить статус предложения (Cargo)
# @router.post("/cargo/reject/{id}")
# def reject_cargo(id: int, db: Session = Depends(get_db)):
#     return update_cargo_status(db, id, "cancel")
