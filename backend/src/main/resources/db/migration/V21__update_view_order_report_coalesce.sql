CREATE OR REPLACE VIEW vw_order_report AS
SELECT
    o.id AS order_id,
    COALESCE(o.customer_name, '')::VARCHAR(120) AS customer_name,
    COALESCE(o.customer_email, '')::VARCHAR(255) AS customer_email,
    COALESCE(o.customer_phone, '')::VARCHAR(30) AS customer_phone,
    o.created_at,
    o.paid_at,
    o.processing_at,
    o.shipped_at,
    o.delivered_at,
    o.cancelled_at,
    o.expired_at,
    COALESCE(o.shipping_service_name, '')::VARCHAR(120) AS shipping_service_name,
    o.shipping_service_code,
    o.shipping_company,
    o.shipping_delivery_days,
    o.subtotal_amount AS subtotal,
    o.shipping_cost_amount AS shipping_cost,
    o.total_amount AS total,
    COALESCE(o.shipping_street, '')::VARCHAR(150) AS shipping_street,
    COALESCE(o.shipping_number, '')::VARCHAR(30) AS shipping_number,
    COALESCE(o.shipping_complement, '')::VARCHAR(100) AS shipping_complement,
    COALESCE(o.shipping_neighborhood, '')::VARCHAR(100) AS shipping_neighborhood,
    COALESCE(o.shipping_city, '')::VARCHAR(100) AS shipping_city,
    COALESCE(o.shipping_state, '')::VARCHAR(2) AS shipping_state,
    COALESCE(o.shipping_postal_code, '')::VARCHAR(20) AS shipping_postal_code,
    CONCAT_WS(', ',
        NULLIF(o.shipping_street, ''),
        NULLIF(o.shipping_number, '')
    ) AS shipping_address_line_1,
    CONCAT_WS(' - ',
        NULLIF(o.shipping_neighborhood, ''),
        NULLIF(CONCAT_WS('/',
            NULLIF(o.shipping_city, ''),
            NULLIF(o.shipping_state, '')
        ), '')
    ) AS shipping_address_line_2
FROM tb_orders o;
