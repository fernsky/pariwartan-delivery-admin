CREATE TABLE acme_ward_demographics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    municipality_id uuid NOT NULL,
    ward_no integer NOT NULL,
    included_vdc_or_municipality text NOT NULL,
    population integer NOT NULL,
    area_sq_km decimal(10, 2) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

INSERT INTO acme_ward_demographics (municipality_id, ward_no, included_vdc_or_municipality, population, area_sq_km) 
VALUES 
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 1, 'कुरेली (१–९)', 2939, 47.76),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 2, 'राडसी (१–९)', 4928, 32.69),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 3, 'इरिवाङ (५–९)', 3227, 12.68),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 4, 'पाख्वाङ (१–९)', 4361, 31.72),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 5, 'राङ्कोट (१–९)', 3955, 24.96),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 6, 'इरिवाङ (१–४)', 2261, 13.20);
