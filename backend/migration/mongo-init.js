db = db.getSiblingDB('traffic');

db.createCollection('users');

db.users.insertMany([
  {
    "_id": ObjectId("67bdba945cbb0a21ea239d37"),
    "username": "admin",
    "name": "Nguyễn Văn A",
    "password": "$2a$14$WCxKqsjA0yd8TVuI0dVAr.XPR4OxC.nSgx9v/pmKrl1LIwW9a59m2",
    "role": "admin",
    "status": "ACTIVE",
    "policeId": "ID-1234",
    "position": "Đại Tá"
  },
  {
    "_id": ObjectId("67bdbaef5cbb0a21ea239d3c"),
    "username": "user1",
    "name": "Nguyễn Văn B",
    "password": "$2a$14$WCxKqsjA0yd8TVuI0dVAr.XPR4OxC.nSgx9v/pmKrl1LIwW9a59m2",
    "role": "user",
    "status": "ACTIVE",
    "policeId": "ID-43534",
    "position": "Thượng Úy"
  }
]);

db.createCollection('violationTypes');

db.violationTypes.insertMany([
  {
    "_id": ObjectId("67bf32720bc1487e7b066e51"),
    "name": "Vượt Đèn Đỏ",
    "amountFrom": NumberInt(4000000),
    "amountTo": NumberInt(6000000),
    "status": "ACTIVE",
    "vehicleType": "MOTORBIKE"
  },
  {
    "_id": ObjectId("67c04507d786484dc7a86be9"),
    "name": "Đi ngược chiều",
    "amountFrom": NumberInt(4000000),
    "amountTo": NumberInt(6000000),
    "status": "ACTIVE",
    "vehicleType": "MOTORBIKE"
  }
]);

db.createCollection('violations');

db.violations.insertMany([
  {
    "_id": ObjectId("67bf42b202431ec44788105c"),
    "driverName": "test",
    "vehicleName": "test1",
    "violationDate": ISODate("2025-02-13T16:51:00.000+0000"),
    "violationType": ObjectId("67bf32720bc1487e7b066e51"),
    "amount": NumberInt(1000000),
    "status": "INACTIVE",
    "DriverIdAddress": "dcdsf",
    "DriverIdDate": "2025-02-20",
    "driverAddress": "test",
    "driverComment": "test",
    "driverDob": "2025-02-20",
    "driverId": "test",
    "driverJob": "test",
    "driverNationality": "test",
    "itemsKepp": "test",
    "locationCity": "Hà Nội",
    "locationDistrict": "Thanh Xuân",
    "locationStreet": "test",
    "officerComment": "test",
    "officerId": ObjectId("67bdbaef5cbb0a21ea239d3c"),
    "penalty": NumberInt(1000000),
    "driverIdAddress": "test",
    "driverIdDate": "2025-01-29"
  },
  {
    "_id": ObjectId("67c486745cbb0a21ea23c8bd"),
    "driverName": "test",
    "vehicleName": "test1",
    "violationDate": ISODate("2025-02-09T16:51:00.000+0000"),
    "violationType": ObjectId("67bf32720bc1487e7b066e51"),
    "amount": NumberInt(1000000),
    "status": "INACTIVE",
    "DriverIdAddress": "dcdsf",
    "DriverIdDate": "2025-02-20",
    "driverAddress": "test",
    "driverComment": "test",
    "driverDob": "2025-02-20",
    "driverId": "test",
    "driverJob": "test",
    "driverNationality": "test",
    "itemsKepp": "test",
    "locationCity": "Hà Nội",
    "locationDistrict": "Thanh Xuân",
    "locationStreet": "test",
    "officerComment": "test",
    "officerId": ObjectId("67bdbaef5cbb0a21ea239d3c"),
    "penalty": NumberInt(1000000),
    "driverIdAddress": "test",
    "driverIdDate": "2025-01-29"
  },
  {
    "_id": ObjectId("67c486ba5cbb0a21ea23c8bf"),
    "driverName": "test",
    "vehicleName": "test1",
    "violationDate": ISODate("2025-03-22T16:51:00.000+0000"),
    "violationType": ObjectId("67bf32720bc1487e7b066e51"),
    "amount": NumberInt(1000000),
    "status": "INACTIVE",
    "DriverIdAddress": "dcdsf",
    "DriverIdDate": "2025-02-20",
    "driverAddress": "test",
    "driverComment": "test",
    "driverDob": "2025-02-20",
    "driverId": "test",
    "driverJob": "test",
    "driverNationality": "test",
    "itemsKepp": "test",
    "locationCity": "Hà Nội",
    "locationDistrict": "Ba Đình",
    "locationStreet": "test",
    "officerComment": "test",
    "officerId": ObjectId("67bdbaef5cbb0a21ea239d3c"),
    "penalty": NumberInt(1000000),
    "driverIdAddress": "test",
    "driverIdDate": "2025-01-29"
  }
]);
