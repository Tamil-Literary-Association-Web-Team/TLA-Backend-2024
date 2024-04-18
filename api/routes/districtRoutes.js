const express = require("express");
const router = express.Router();
const districtController = require("../controllers/districtController");

router.get("/", districtController.getAllDistricts);
// router.post("/", districtController.createDistrict);
// router.get("/:districtId", districtController.getDistrictById);
// router.put("/:districtId", districtController.updateDistrict);
// router.delete("/:districtId", districtController.deleteDistrict);

module.exports = router;
