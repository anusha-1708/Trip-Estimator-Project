import mongoose from "mongoose";
import Trip from "../models/trips.schema.js";
import SharedTrip from "../models/sharedTrip.schema.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const currentYear = new Date().getFullYear();

    const start = new Date(`${currentYear}-01-01`);
    const end = new Date(`${currentYear + 1}-01-01`);

    const totalTrips = await Trip.countDocuments({
      created_by: userId,
      deleted_at: null,
      createdAt: { $gte: start, $lt: end },
    });

    const totalSharedTrips = await SharedTrip.countDocuments({
      "participants.user": userId,
    });

    const trips = await Trip.find({
      created_by: userId,
      deleted_at: null,
      createdAt: { $gte: start, $lt: end },
    });

    let totalAmount = 0;

    trips.forEach((trip) => {
      const fixed =
        (trip.fixedExpense?.foodExpense || 0) +
        (trip.fixedExpense?.travelExpense || 0) +
        (trip.fixedExpense?.stayExpense || 0);

      const other = (trip.otherExpense || []).reduce(
        (sum, item) => sum + (item.otherExpenses || 0),
        0,
      );

      totalAmount += fixed + other;
    });

    res.status(200).json({
      success: true,
      data: {
        totalTrips,
        totalSharedTrips,
        totalAmount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
