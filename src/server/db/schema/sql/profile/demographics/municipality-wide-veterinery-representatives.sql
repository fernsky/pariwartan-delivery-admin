CREATE TABLE IF NOT EXISTS municipality_wide_veterinery_representatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    serial_number INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    name_english VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    position_english VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    branch VARCHAR(100) NOT NULL,
    branch_english VARCHAR(100) NOT NULL,
    remarks TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(serial_number)
);

-- Insert sample data
INSERT INTO municipality_wide_veterinery_representatives (
    serial_number, name, name_english, position, position_english,
    contact_number, branch, branch_english, remarks
) VALUES 
(1, 'विष्णु बुढा', 'Bishnu Budha', 'पशु स्वास्थ्य प्राविधिक', 'Animal Health Technician', '9842591264', 'पशु सेवा शाखा', 'Animal Service Branch', ''),
(2, 'निराजन शर्मा', 'Nirajan Sharma', 'नायब पशु स्वास्थ्य प्राविधिक', 'Assistant Animal Health Technician', '9841815740', 'पशु सेवा शाखा', 'Animal Service Branch', ''),
(3, 'खुम ब. वली', 'Khum B. Wali', 'नायब पशु सेवा प्राविधिक', 'Assistant Animal Service Technician', '9869982953', 'पशु सेवा शाखा', 'Animal Service Branch', ''),
(4, 'शेर ब.वली', 'Sher B. Wali', 'नायब पशु सेवा प्राविधिक', 'Assistant Animal Service Technician', '9864843722', 'पशु सेवा शाखा', 'Animal Service Branch', ''),
(5, 'प्रशन्न घर्तीमगर', 'Prashanna Ghartimagar', 'नायब पशु सेवा प्राविधिक', 'Assistant Animal Service Technician', '9867145226', 'पशु सेवा शाखा', 'Animal Service Branch', '')
ON CONFLICT (serial_number) DO NOTHING;
