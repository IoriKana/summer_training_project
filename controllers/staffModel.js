const STATUS = require("../modules/status").STATUS;
const respond = require("../modules/helperMethods").respond;
const catchAsync = require("../utils/catchAsync");
const staff = require("../models/staffModel");


exports.getAllStaff = catchAsync(async (req, res, next) => {
    const staffMembers = await staff.find().populate("account");
    respond(res, STATUS.OK, staffMembers);
});

exports.getStaff = catchAsync(async (req, res, next) => {
    const staffMember = await staff.findById({_id:req.params.id}).populate("account");
    if (!staffMember) {
        return respond(res, STATUS.NOT_FOUND, { message: "Staff member not found" });
    }
    respond(res, STATUS.OK, staffMember);
});

exports.createStaff = catchAsync(async (req, res, next) => {
    const newStaff = await staff.create(req.body);
    respond(res, STATUS.CREATED, newStaff);
});

exports.updateStaff = catchAsync(async (req, res, next) => {
    const staffMember = await staff.findOneAndUpdate({_id:req.params.id}, req.body, {
        new: true
    });
    if (!staffMember) {
        return respond(res, STATUS.NOT_FOUND, { message: "Staff member not found" });
    }
    respond(res, STATUS.OK, staffMember);
});

exports.deleteStaff = catchAsync(async (req, res, next) => {
    const staffMember = await staff.findOneAndDelete({_id:req.params.id});
    if (!staffMember) {
        return respond(res, STATUS.NOT_FOUND, { message: "Staff member not found" });
    }
    respond(res, STATUS.NO_CONTENT, null);
});