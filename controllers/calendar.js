const Booking = require('../models/Booking');
const Provider = require('../models/Provider');
const User = require('../models/User');

exports.getCalendarByDate = async (req, res, next) => {
    try {
        const bookings = await Booking.find().sort({ bookDate: 1 }); 

        let calendar = [];
        let addDate = '';

        for (const booking of bookings) {
            if (!booking.bookDate) {
                console.log("booking.bookDate is null");
                continue; 
            }
            
            const bookingDate = booking.bookDate.toISOString().slice(0, 10); 
            if (bookingDate !== addDate) {
                calendar.push(`bookDate ${bookingDate}:`);
                addDate = bookingDate;
            }
            
            const provider = await Provider.findById(booking.provider);
            const user = await User.findById(booking.user);

            if (provider && user) {
                calendar.push(`     IDorder: ${booking._id}, user: ${user.name}, provider: ${provider.name}`);
            } else {
                calendar.push(`     IDorder: ${booking._id}, user: Not Found, provider: Not Found`);
            }
        }

        res.status(200).json({
            success: true,
            data: calendar
        });
    } catch (error) {
        console.error(error.stack);
        res.status(400).json({ success: false, error: error.message });
    }
};