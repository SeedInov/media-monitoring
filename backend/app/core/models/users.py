from datetime import datetime
from enum import Enum
from piccolo.table import Table
from piccolo.columns import Varchar, Boolean, Timestamp, Integer, Email
from piccolo.columns import JSON


class Role(str, Enum):
    user = "user"
    admin = "admin"
    superadmin = "superadmin"


class User(Table, tablename="users"):
    id = Integer(primary_key=True, nullable=False)
    first_name = Varchar(length=50, null=True)
    last_name = Varchar(length=50, null=True)
    email = Email(length=255, unique=True, null=False)
    password_hash = Varchar(length=255, null=False)
    is_active = Boolean(default=True)
    is_verified = Boolean(default=False)
    role = Varchar(length=50, null=True, default=Role.user)
    last_login = Timestamp(null=True)
    date_joined = Timestamp(null=False, default=datetime.now)
    picture = Varchar(length=255, null=True)
    phone = Varchar(length=15, null=True)
    reset_token = Varchar(length=255, null=True)
    reset_token_expiry = Timestamp(null=True)
    metadata = JSON(null=True)
