// src/pages/login.jsx - Login Page Component
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        // User is already logged in, redirect to dashboard
        router.push('/');
      }
    } catch (error) {
      // User not logged in, stay on login page
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Successful login, redirect to home page
        router.push('/');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-emerald-50 flex items-center justify-center p-6">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Crimson+Text:wght@400;600&display=swap');
          .font-display { font-family: 'Playfair Display', serif; }
          .font-body { font-family: 'Crimson Text', serif; }
          
          .ornate-divider {
            background: linear-gradient(90deg, transparent, #d4af37, transparent);
            height: 1px; margin: 2rem 0; position: relative;
          }
          .ornate-divider::after {
            content: '❦'; position: absolute; top: 50%; left: 50%;
            transform: translate(-50%, -50%); background: #f8fafc;
            padding: 0 1rem; color: #d4af37; font-size: 1rem;
          }
        `}
      </style>
      
      <Card className="w-full max-w-md border-2 border-emerald-200 shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-amber-50">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-700 to-emerald-800 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-amber-100" />
            </div>
          </div>
          <CardTitle className="font-display text-2xl font-bold text-emerald-900">
            Member Login
          </CardTitle>
          <p className="font-body text-emerald-700 mt-2">
            Nederlandse Bond der Croquet
          </p>
          <div className="ornate-divider"></div>
        </CardHeader>
        
        <CardContent className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="font-body text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800">
                Email Address
              </Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
                className="font-body border-emerald-200 focus:border-emerald-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="font-body font-semibold text-emerald-800">
                Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Your password"
                  required
                  className="font-body border-emerald-200 focus:border-emerald-400 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-600 hover:text-emerald-800"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-amber-100 font-body font-semibold py-3 transition-all duration-300"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="font-body text-sm text-emerald-600">
              For membership inquiries, please contact your local club secretary
            </p>
          </div>
          
          {/* Test credentials info - remove in production */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="font-body text-blue-800 text-sm font-semibold mb-2">Test Credentials:</p>
            <p className="font-body text-blue-700 text-xs">Admin: admin@croquet.nl / admin123</p>
            <p className="font-body text-blue-700 text-xs">Member: member@croquet.nl / member123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}