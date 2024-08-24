const { admin_log } = require('../models');

const logToDatabase = async (req, res, next) => {
  const saveLog = async () => {
    try {
      const { method, originalUrl, params, body } = req;
      const status = res.statusCode;

      if (req.user && req.user.roleId === 3) {
        let logMessage = '';

        // Buat pesan log yang lebih deskriptif berdasarkan URL dan status
        if (originalUrl.includes('/updateSubmissionStatus')) {
          // Contoh: Ubah status pengajuan
          const submissionId = params.id; // ID pengajuan dari URL
          const newStatus = body.status; // Status baru dari body request
          logMessage = `${req.user.username} updated submission ${submissionId} to status ${newStatus}`;
        } else if (originalUrl.includes('/createSubmission')) {
          // Log khusus untuk endpoint lain
          logMessage = `${req.user.username} created a new submission`;
        } else if (originalUrl.includes('/deleteSubmission')) {
          // Log khusus untuk penghapusan submission
          const submissionId = params.id;
          logMessage = `${req.user.username} deleted submission ${submissionId}`;
        } else if (originalUrl.includes('/someOtherEndpoint')) {
          // Tambahkan logika khusus untuk endpoint lain jika diperlukan
          logMessage = `${req.user.username} performed an action on ${originalUrl}`;
        } else {
          // Log umum untuk permintaan lain
          logMessage = `${req.user.username} made a ${method} request to ${originalUrl} with status ${status}`;
        }

        await admin_log.create({
          user_id: req.user.userId,
          title: `Admin action: ${method} ${originalUrl}`,
          description: logMessage,
          status: status,
          action_type: method,
        });
      }
    } catch (error) {
      console.error('Failed to save log to database', error);
    }
  };

  // Simpan log setelah respons selesai dikirim
  res.on('finish', saveLog);

  next();
};

module.exports = logToDatabase;
