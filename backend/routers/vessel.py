from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from crud import  (create_vessel, create_cargo, get_vessel, get_cargo, create_catcher, get_catcher,
        create_vessel, create_cargo, get_vessel, get_cargo, get_pending_vessel, 
        get_pending_cargo, update_vessel_status, update_cargo_status)
from schemas import CatcherAddItem, VesselAddItem, CargoAddItem, CatcherItem, VesselItem, CargoItem
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


@router.get("/pending_vessels")
def get_pending_vessels(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """Получение списка судов, ожидающих подтверждения"""
    return get_pending_vessel(db, skip=skip, limit=limit)


@router.get("/pending_cargo")
def get_pending_cargos(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """Получение списка грузов, ожидающих подтверждения"""
    return get_pending_cargo(db, skip=skip, limit=limit)


@router.post("/approve_vessel/{vessel_id}", response_model=VesselItem)
def approve_vessel_endpoint(vessel_id: int, db: Session = Depends(get_db)):
    """Подтверждение записи о судне"""
    try:
        return update_vessel_status(db, vessel_id, "approved")
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при подтверждении судна: {str(e)}")


@router.post("/reject_vessel/{vessel_id}", response_model=VesselItem)
def reject_vessel_endpoint(vessel_id: int, db: Session = Depends(get_db)):
    """Отклонение записи о судне"""
    try:
        return update_vessel_status(db, vessel_id, "rejected")
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при отклонении судна: {str(e)}")


@router.post("/approve_cargo/{cargo_id}", response_model=CargoItem)
def approve_cargo_endpoint(cargo_id: int, db: Session = Depends(get_db)):
    """Подтверждение записи о грузе"""
    try:
        return update_cargo_status(db, cargo_id, "approved")
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при подтверждении груза: {str(e)}")


@router.post("/reject_cargo/{cargo_id}", response_model=CargoItem)
def reject_cargo_endpoint(cargo_id: int, db: Session = Depends(get_db)):
    """Отклонение записи о грузе"""
    try:
        return update_cargo_status(db, cargo_id, "rejected")
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при отклонении груза: {str(e)}")