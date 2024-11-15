import React, { useState} from 'react';

const ShowList = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const getList = async () => {
        try {
            const response = await fetch('https://672cb0b81600dda5a9f980b5.mockapi.io/api/v1/oss_hw4');
            if (response.ok) {
                const data = await response.json();
                setStudents(data);
            } else {
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleCreate = async (newStudent) => {
        try {
            const response = await fetch('https://672cb0b81600dda5a9f980b5.mockapi.io/api/v1/oss_hw4', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStudent),
            });
            if (response.ok) {
                getList();
                setShowCreateModal(false);
            }
        } catch (error) {
            console.error('Error creating data:', error);
        }
    };

    const handleUpdate = async (updatedStudent) => {
        try {
            const response = await fetch(`https://672cb0b81600dda5a9f980b5.mockapi.io/api/v1/oss_hw4/${updatedStudent.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedStudent),
            });
            if (response.ok) {
                getList();
                setShowUpdateModal(false);
            }
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('정말로 삭제하시겠습니까?')) {
            try {
                const response = await fetch(`https://672cb0b81600dda5a9f980b5.mockapi.io/api/v1/oss_hw4/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    getList();
                }
            } catch (error) {
                console.error('Error deleting data:', error);
            }
        }
    };

    return (
        <div className="container my-4">
            <button className="btn btn-primary mb-2" onClick={() => setShowCreateModal(true)}>Create Data</button>
            <button className="btn btn-secondary mb-2" onClick={getList}>Get Data</button>
            {students.length > 0 ? (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Update</th>
                            <th>Delete</th>
                            <th>#</th>
                            <th>ID</th>
                            <th>Student Number</th>
                            <th>Name</th>
                            <th>1st Major</th>
                            <th>2nd Major</th>
                            <th>Email</th>
                            <th>Birthdate</th>
                            <th>RC</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr key={student.id}>
                                <td>
                                    <button className="btn btn-warning" onClick={() => {
                                        setSelectedStudent(student);
                                        setShowUpdateModal(true);
                                    }}>Update</button>
                                </td>
                                <td>
                                    <button className="btn btn-danger" onClick={() => handleDelete(student.id)}>Delete</button>
                                </td>
                                <th>{index + 1}</th>
                                <td>{student.id}</td>
                                <td>{student.student_number}</td>
                                <td>{student.name}</td>
                                <td>{student['1_major']}</td>
                                <td>{student['2_major']}</td>
                                <td>{student.email}</td>
                                <td>{student.birthdate}</td>
                                <td>{student.rc}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>"Create Data" 버튼을 눌러 데이터를 추가하세요 <br></br>"Get Data" 버튼을 눌러 데이터를 가져오세요.</p>
            
            )}

            {/* Modals */}
            {showCreateModal && (
                <CreateModal onClose={() => setShowCreateModal(false)} onCreate={handleCreate} />
            )}
            {showUpdateModal && selectedStudent && (
                <UpdateModal
                    student={selectedStudent}
                    onClose={() => setShowUpdateModal(false)}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
};


// Define CreateModal and UpdateModal as separate functional components


const CreateModal = ({ onClose, onCreate }) => {
    const [formData, setFormData] = useState({
        id: '',
        student_number: '',
        name: '',
        '1_major': '',
        '2_major': '',
        email: '',
        birthdate: '',
        rc: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
        validateInput(id, value);
    };

    const validateInput = (field, value) => {
        let error = '';

        switch (field) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    error = 'Invalid email format';
                }
                break;
            case 'student_number':
                const numberRegex = /^\d+$/;
                if (!numberRegex.test(value)) {
                    error = 'Student number must be numeric';
                }
                break;
            case 'id':
            case 'name':
            case '1_major':
            case 'rc':
                if (!value) {
                    error = `${field.replace(/_/g, ' ')} is required`;
                }
                break;
            default:
                break;
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: error
        }));
    };

    const isFormValid = () => {
        return !Object.values(errors).some((error) => error) && 
               Object.values(formData).slice(0, 6).every((field) => field !== '');
    };

    const handleSubmit = () => {
        if (isFormValid()) {
            onCreate(formData);
        } else {
            alert('Please correct the errors in the form');
        }
    };

    return (
        <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Enter Data</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            {Object.keys(formData).map((key, index) => (
                                <div className="mb-3" key={index}>
                                    <label htmlFor={key} className="form-label">{key.replace(/_/g, ' ')}</label>
                                    <input
                                        type={key === 'email' ? 'email' : key === 'birthdate' ? 'date' : 'text'}
                                        className="form-control"
                                        id={key}
                                        value={formData[key]}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors[key] && <small className="text-danger">{errors[key]}</small>}
                                </div>
                            ))}
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={!isFormValid()}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const UpdateModal = ({ student, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        id: student.id || '', // Add id as a read-only field
        student_number: student.student_number || '',
        name: student.name || '',
        '1_major': student['1_major'] || '',
        '2_major': student['2_major'] || '',
        email: student.email || '',
        birthdate: student.birthdate || '',
        rc: student.rc || ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
        validateInput(id, value);
    };

    const validateInput = (field, value) => {
        let error = '';

        switch (field) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    error = 'Invalid email format';
                }
                break;
            case 'student_number':
                const numberRegex = /^\d+$/;
                if (!numberRegex.test(value)) {
                    error = 'Student number must be numeric';
                }
                break;
            case 'name':
            case '1_major':
            case 'rc':
                if (!value) {
                    error = `${field.replace(/_/g, ' ')} is required`;
                }
                break;
            default:
                break;
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: error
        }));
    };

    const isFormValid = () => {
        return !Object.values(errors).some((error) => error) && 
               Object.values(formData).slice(1).every((field) => field !== '');
    };

    const handleSubmit = () => {
        if (isFormValid()) {
            onUpdate(formData);
        } else {
            alert('Please correct the errors in the form');
        }
    };

    return (
        <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Update Data</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            {Object.keys(formData).map((key, index) => (
                                <div className="mb-3" key={index}>
                                    <label htmlFor={key} className="form-label">{key.replace(/_/g, ' ')}</label>
                                    <input
                                        type={key === 'email' ? 'email' : key === 'birthdate' ? 'date' : 'text'}
                                        className="form-control"
                                        id={key}
                                        value={formData[key]}
                                        onChange={handleChange}
                                        readOnly={key === 'id'} // Make the id field read-only
                                        required={key !== '2_major'} // Make '2_major' optional
                                    />
                                    {errors[key] && <small className="text-danger">{errors[key]}</small>}
                                </div>
                            ))}
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={!isFormValid()}>Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ShowList;
