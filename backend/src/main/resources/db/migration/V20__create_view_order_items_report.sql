CREATE OR REPLACE VIEW vw_order_items_report AS
SELECT
    oi.order_id AS order_id,
    oi.book_title AS book_title,
    oi.quantity AS quantity,
    oi.unit_price_amount AS unit_price,
    (oi.unit_price_amount * oi.quantity) AS subtotal
FROM tb_order_items oi;
