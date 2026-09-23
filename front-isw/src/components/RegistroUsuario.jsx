import { useState } from 'react';

export default function RegistroUsuario({ onIngresar }) {
  const [esLogin, setEsLogin] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol: 'ESTUDIANTE',
    rut: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje('');
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
      const data = await response.json();

      if (data.exito) {
        setError(false);
        localStorage.setItem('usuario', JSON.stringify(data));

        // Cambiar esta parte:
        if (onIngresar) {
          onIngresar(data);
        }
      } else {
        setError(true);
        setMensaje(data.mensaje || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError(true);
      setMensaje('Error de conexión con el servidor backend');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMensaje('');
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (data.exito) {
        setError(false);
        setMensaje('¡Registro exitoso! Ya puedes iniciar sesión con tus credenciales.');
        setEsLogin(true);
      } else {
        setError(true);
        setMensaje(data.mensaje || 'Error al registrar usuario');
      }
    } catch (err) {
      setError(true);
      setMensaje('Error de conexión con el servidor backend');
    }
  };

  return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '440px',
          borderRadius: '12px',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.08)',
          color: '#1e293b',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          overflow: 'hidden'
        }}>
          <div style={{
            backgroundColor: '#25547b',
            padding: '24px 28px',
            color: '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '0.5px'
            }}>
              MD's
            </span>
              <h2 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#ffffff', lineHeight: '1.2' }}>
                MateDocs
              </h2>
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1' }}>
              {esLogin ? 'Inicie sesión en su cuenta' : 'Cree su cuenta para comenzar'}
            </p>
          </div>

          <div style={{ padding: '32px 28px' }}>
            {mensaje && (
                <div style={{
                  padding: '12px 16px',
                  marginBottom: '20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  backgroundColor: error ? '#fef2f2' : '#f0fdf4',
                  color: error ? '#991b1b' : '#166534',
                  border: `1px solid ${error ? '#fecaca' : '#bbf7d0'}`
                }}>
                  {mensaje}
                </div>
            )}

            {esLogin ? (
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>
                      Correo electrónico
                    </label>
                    <input
                        type="email"
                        name="email"
                        placeholder="ejemplo@correo.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          color: '#1e293b',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                          outline: 'none'
                        }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>
                      Contraseña
                    </label>
                    <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          color: '#1e293b',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                          outline: 'none'
                        }}
                    />
                  </div>

                  <button
                      type="submit"
                      style={{
                        marginTop: '6px',
                        padding: '12px',
                        backgroundColor: '#25547b',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: '600',
                        fontSize: '15px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                  >
                    Ingresar al Sistema
                  </button>

                  <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: '10px', marginBottom: 0 }}>
                    ¿Aún no tienes cuenta?{' '}
                    <span
                        onClick={() => { setEsLogin(false); setMensaje(''); }}
                        style={{ color: '#25547b', cursor: 'pointer', textDecoration: 'underline', fontWeight: '600' }}
                    >
                  Regístrate aquí
                </span>
                  </p>
                </form>
            ) : (
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>
                        Nombre
                      </label>
                      <input
                          type="text"
                          name="nombre"
                          placeholder="Juan"
                          value={formData.nombre}
                          onChange={handleChange}
                          required
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            backgroundColor: '#ffffff',
                            color: '#1e293b',
                            fontSize: '14px',
                            boxSizing: 'border-box',
                            outline: 'none'
                          }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>
                        Apellido
                      </label>
                      <input
                          type="text"
                          name="apellido"
                          placeholder="Pérez"
                          value={formData.apellido}
                          onChange={handleChange}
                          required
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            backgroundColor: '#ffffff',
                            color: '#1e293b',
                            fontSize: '14px',
                            boxSizing: 'border-box',
                            outline: 'none'
                          }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>
                      RUT
                    </label>
                    <input
                        type="text"
                        name="rut"
                        placeholder="12345678-9"
                        value={formData.rut}
                        onChange={handleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          color: '#1e293b',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                          outline: 'none'
                        }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>
                      Correo electrónico
                    </label>
                    <input
                        type="email"
                        name="email"
                        placeholder="correo@ejemplo.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          color: '#1e293b',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                          outline: 'none'
                        }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>
                      Contraseña
                    </label>
                    <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          color: '#1e293b',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                          outline: 'none'
                        }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>
                      Rol de Usuario
                    </label>
                    <select
                        name="rol"
                        value={formData.rol}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          color: '#1e293b',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                          outline: 'none'
                        }}
                    >
                      <option value="ESTUDIANTE">Estudiante</option>
                      <option value="PROFESOR">Profesor de Asignatura</option>
                      <option value="TUTOR">Tutor Universidad</option>
                      <option value="COORDINADOR">Coordinador de Práctica</option>
                      <option value="COLABORADOR">Colaborador</option>
                    </select>
                  </div>

                  <button
                      type="submit"
                      style={{
                        marginTop: '6px',
                        padding: '12px',
                        backgroundColor: '#25547b',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: '600',
                        fontSize: '15px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                  >
                    Registrar Usuario
                  </button>

                  <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: '10px', marginBottom: 0 }}>
                    ¿Ya tienes una cuenta?{' '}
                    <span
                        onClick={() => { setEsLogin(true); setMensaje(''); }}
                        style={{ color: '#25547b', cursor: 'pointer', textDecoration: 'underline', fontWeight: '600' }}
                    >
                  Inicia sesión aquí
                </span>
                  </p>
                </form>
            )}
          </div>
        </div>
      </div>
  );
}