const router = require("express").Router();
const pool = require("../config/database/postgresql");
const authGuard = require("../middleware/authGuard");

router.get("/post", authGuard, async (req, res, next) => {
    const { title, content } = req.query;
    const result = {
        data: [],
    }

    try {
        let sql = `SELECT post_tb.*, user_tb.name AS author_name 
                        FROM post_tb 
                        JOIN user_tb 
                        ON post_tb.user_id = user_tb.id WHERE 1 = 1`;
        const params = [];

        if (title) {
            sql += ' AND title LIKE $1';
            params.push(`%${title}%`);
        }

        if (content) {
            sql += ' AND content LIKE $1';
            params.push(`%${content}%`);
        }

        const data = await pool.query(sql, params);
        if (data.rowCount !== 0) {
            result.data = data.rows;
        }
        res.send(result);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
