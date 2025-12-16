/* Tables */

CREATE TABLE WRISTBAND (
    wristband_id INTEGER PRIMARY KEY,
    production_date DATE NOT NULL
);

/* ----------------------------------------------- */
CREATE TABLE PATIENT (
    patient_id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    threshold_profile VARCHAR(30) NOT NULL
        CHECK (threshold_profile IN (
            'STANDARD',
            'CARDIAC',
            'ELDERLY',
            'RESPIRATORY_RISK',
            'HIGH_RISK'
        ))
);


/* ----------------------------------------------- */
CREATE TABLE WRISTBAND_ASSIGNMENT (
    assignment_id INTEGER PRIMARY KEY,
    wristband_id INTEGER NOT NULL,
    patient_id INTEGER NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,

    FOREIGN KEY (wristband_id)
        REFERENCES WRISTBAND(wristband_id),

    FOREIGN KEY (patient_id)
        REFERENCES PATIENT(patient_id)
);

CREATE UNIQUE INDEX one_active_assignment
ON WRISTBAND_ASSIGNMENT (wristband_id)
WHERE end_date IS NULL;


/* ----------------------------------------------- */
CREATE TABLE ALERT (
    alert_id INTEGER PRIMARY KEY,

    assignment_id INTEGER NOT NULL,

    generated_at TIMESTAMP NOT NULL,
    acknowledged_at TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by VARCHAR(50),
    clinical_note TEXT,

    message TEXT NOT NULL,
    alert_type VARCHAR(30) NOT NULL,
    severity VARCHAR(20) NOT NULL,

    status VARCHAR(30) NOT NULL
        CHECK (status IN (
            'JUST_GENERATED',
            'ACKNOWLEDGED',
            'CLINICALLY_ASSESSED',
            'CLOSED'
        )),

    threshold_profile VARCHAR(30) NOT NULL,

    FOREIGN KEY (assignment_id)
        REFERENCES WRISTBAND_ASSIGNMENT(assignment_id)
);

/* ----------------------------------------------- */
CREATE TABLE VITAL_MEASUREMENT (
    measurement_id INTEGER PRIMARY KEY,

    wristband_id INTEGER NOT NULL,
    patient_id INTEGER NOT NULL,

    measured_at TIMESTAMP NOT NULL,

    heart_rate INTEGER,
    spo2 INTEGER,
    temperature DECIMAL(4,1),
    motion DECIMAL(6,3),
    battery_level INTEGER CHECK (battery_level BETWEEN 0 AND 100),

    FOREIGN KEY (wristband_id)
        REFERENCES WRISTBAND(wristband_id),

    FOREIGN KEY (patient_id)
        REFERENCES PATIENT(patient_id)
);
