import { useState } from 'react';
import toast from 'react-hot-toast';
import styles from './DonationCertificateForm.module.css';

const KANNUR_HOSPITALS = [
    'District Hospital Blood Bank, Kannur',
    'Govt Medical College Hospital, Pariyaram',
    'Academy of Medical Sciences, Pariyaram',
    'General Hospital, Thalassery',
    'Malabar Cancer Centre Society, Moozhikkara',
    'Tellichery Co-operative Hospital, Thalassery',
    'Josgiri Hospital, Thalassery',
    'Kannur Co-operative Hospital Society, Talap',
    'Payyannur Co-operative Hospital Society Ltd, Payyannur',
    'Co-operative Hospital Society Ltd, Taliparamba',
    'AKG Memorial Co-operative Hospital, Kannur',
    'Aster MIMS, Kannur',
    'Amala Multi Speciality Hospital, Kannur',
    'Lourde Hospital, Taliparamba',
    'Indira Gandhi Co-operative Hospital, Thalassery',
    'Thana Speciality Hospital, Kannur',
    'Koyili Hospital, Kannur',
    'Dhanalakshmi Hospital, Kannur',
    'Ashirvad Hospital, Kannur',
    'Fathima Hospital, Kannur',
    'Unity Hospital, Kannur',
    'Iritty Taluk Hospital',
    'Mattannur CHC',
    'Payyannur Taluk Hospital',
    'Taliparamba Taluk Hospital',
    'Other',
];

export default function DonationCertificateForm({
    onClose,
    onSuccess,
}) {

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState('');

    const [results, setResults] = useState([]);

    const [selectedDonor, setSelectedDonor] = useState(null);

    const [proofImage, setProofImage] = useState(null);

    const [form, setForm] = useState({
        donationDate: '',
        hospital: '',
        location: '',
        patientName: '',
        units: '',
        remarks: '',
    });

    const [hospitalSearch, setHospitalSearch] = useState('');
    const [showHospitals, setShowHospitals] = useState(false);

    const filteredHospitals = KANNUR_HOSPITALS.filter((hospital) =>
        hospital.toLowerCase().includes(hospitalSearch.toLowerCase())
    );

    const set = (key) => (e) => {
        setForm((f) => ({
            ...f,
            [key]: e.target.value,
        }));
    };

    // SEARCH DONORS
    const searchDonors = async (value) => {

        setSearch(value);

        if (value.length < 2) {
            setResults([]);
            return;
        }

        try {

            const res = await fetch(
                `/api/donors/search?q=${value}`
            );

            const data = await res.json();

            if (data.success) {
                setResults(data.donors);
            }

        } catch (err) {
            console.log(err);
        }
    };

    const convertToBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onload = () => resolve(reader.result);

            reader.onerror = (error) => reject(error);
        });

    // SUBMIT FORM
    const submit = async (e) => {
        e.preventDefault();

        if (!selectedDonor?._id) {
            toast.error('Please select donor profile');
            return;
        }

        if (!form.donationDate || !form.hospital) {
            toast.error('Please fill required fields');
            return;
        }

        try {
            setLoading(true);

            let base64Image = '';

            if (proofImage) {
                base64Image = await convertToBase64(proofImage);
            }

            const payload = {
                donorId: selectedDonor._id,
                donationDate: form.donationDate,
                hospital: form.hospital,
                unitsDonated: form.units,
                notes: form.remarks,
                photo: base64Image,
            };

            const res = await fetch('/api/donations/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (data.success) {
                toast.success('Donation submitted successfully');
                onSuccess?.();
            } else {
                toast.error(data.message || 'Submission failed');
            }

        } catch (err) {
            console.log(err);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (

        <div
            className={styles.overlay}
            onClick={(e) =>
                e.target === e.currentTarget && onClose()
            }
        >

            <div className={styles.modal}>

                <button
                    className={styles.closeBtn}
                    onClick={onClose}
                >
                    ×
                </button>

                <div className={styles.badge}>
                    DONOR APPRECIATION
                </div>

                <h2 className={styles.title}>
                    Submit Donation Details
                </h2>

                <p className={styles.subtitle}>
                    Submit your blood donation details
                    and receive appreciation certificate.
                </p>

                <form onSubmit={submit}>

                    {/* SEARCH */}
                    <div className={styles.searchSection}>

                        <label>
                            Search Your Donor Profile
                        </label>

                        <input
                            type="text"
                            placeholder="Enter name or phone number"
                            value={search}
                            onChange={(e) =>
                                searchDonors(e.target.value)
                            }
                        />

                        {results.length > 0 && (

                            <div className={styles.searchResults}>

                                {results.map((d) => (

                                    <div
                                        key={d._id}
                                        className={styles.searchItem}
                                        onClick={() => {

                                            setSelectedDonor(d);

                                            setSearch(
                                                `${d.name} (${d.bloodGroup})`
                                            );

                                            setResults([]);
                                        }}
                                    >

                                        <div>
                                            <strong>{d.name}</strong>
                                            <span>{d.bloodGroup}</span>
                                        </div>

                                        <small>{d.phone}</small>

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>

                    {/* AUTO FILLED */}
                    <div className={styles.grid2}>

                        <div className={styles.group}>
                            <label>Full Name</label>

                            <input
                                value={selectedDonor?.name || ''}
                                disabled
                            />
                        </div>

                        <div className={styles.group}>
                            <label>Blood Group</label>

                            <input
                                value={
                                    selectedDonor?.bloodGroup || ''
                                }
                                disabled
                            />
                        </div>

                    </div>

                    <div className={styles.grid2}>

                        <div className={styles.group}>
                            <label>Phone Number</label>

                            <input
                                value={selectedDonor?.phone || ''}
                                disabled
                            />
                        </div>

                        <div className={styles.group}>
                            <label>Donor Location</label>

                            <input
                                value={
                                    selectedDonor?.location || ''
                                }
                                disabled
                            />
                        </div>

                    </div>

                    {/* DONATION DETAILS */}
                    <div className={styles.grid2}>

                        <div className={styles.group}>
                            <label>Donation Date *</label>

                            <input
                                type="date"
                                value={form.donationDate}
                                onChange={set('donationDate')}
                            />
                        </div>

                        <div className={styles.group}>
                            <label>Units Donated</label>

                            <input
                                type="text"
                                value={form.units}
                                onChange={set('units')}
                                placeholder="1 Unit"
                            />
                        </div>

                    </div>

                    <div className={styles.grid2}>

                        <div className={styles.group}>
                            <label>Hospital / Blood Bank *</label>

                            <div className={styles.hospitalSearchWrap}>
                                <input
                                    type="text"
                                    value={hospitalSearch || form.hospital}
                                    onFocus={() => setShowHospitals(true)}
                                    onChange={(e) => {
                                        setHospitalSearch(e.target.value);
                                        setForm((f) => ({
                                            ...f,
                                            hospital: e.target.value,
                                        }));
                                        setShowHospitals(true);
                                    }}
                                    placeholder="Search hospital in Kannur district"
                                />

                                {showHospitals && filteredHospitals.length > 0 && (
                                    <div className={styles.hospitalResults}>
                                        {filteredHospitals.map((hospital) => (
                                            <div
                                                key={hospital}
                                                className={styles.hospitalItem}
                                                onClick={() => {
                                                    setForm((f) => ({
                                                        ...f,
                                                        hospital,
                                                    }));
                                                    setHospitalSearch(hospital);
                                                    setShowHospitals(false);
                                                }}
                                            >
                                                {hospital}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.group}>
                            <label>Donation Place</label>

                            <input
                                type="text"
                                value={form.location}
                                onChange={set('location')}
                                placeholder="City / Area"
                            />
                        </div>

                    </div>

                    <div className={styles.group}>
                        <label>Patient Name</label>

                        <input
                            type="text"
                            value={form.patientName}
                            onChange={set('patientName')}
                            placeholder="Optional"
                        />
                    </div>

                    <div className={styles.group}>

                        <label>Remarks</label>

                        <textarea
                            value={form.remarks}
                            onChange={set('remarks')}
                            placeholder="Write something..."
                        />

                    </div>

                    {/* IMAGE */}
                    <div className={styles.group}>

                        <label>
                            Upload Donation Proof *
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setProofImage(e.target.files[0])
                            }
                        />

                        <div className={styles.uploadNote}>
                            Upload hospital slip,
                            donor card or blood bank receipt.
                        </div>

                    </div>

                    <div className={styles.note}>
                        Your submission will be reviewed
                        before certificate approval.
                    </div>

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={loading}
                    >

                        {loading
                            ? 'Submitting...'
                            : 'Submit Donation'}

                    </button>

                </form>

            </div>

        </div>
    );
}