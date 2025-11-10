import React, { useEffect, useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';

const STORAGE_KEY = 'adminProfile_v1';

const AdminProfile = () => {
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [editing, setEditing] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setProfile(JSON.parse(stored));
    else setProfile({ name: 'Administrador', email: 'admin@huertohogar.local' });
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setEditing(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2500);
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Perfil</h1>
      </div>

      {showSaved && <Alert variant="success">Perfil guardado</Alert>}

      <div style={{ background: '#fff', padding: 20, borderRadius: 12 }}>
        {!editing ? (
          <div>
            <p style={{ marginBottom: 8 }}><strong>Nombre:</strong> {profile.name}</p>
            <p style={{ marginBottom: 16 }}><strong>Email:</strong> {profile.email}</p>
            <Button className="btn-modal-success" onClick={() => setEditing(true)}>Editar Perfil</Button>
          </div>
        ) : (
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} />
            </Form.Group>
            <div style={{ display: 'flex', gap: 12 }}>
              <Button className="btn-modal-cancel" onClick={() => setEditing(false)}>Cancelar</Button>
              <Button type="submit" className="btn-modal-success">Guardar</Button>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
