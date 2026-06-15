import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Group, Text, ActionIcon, Tooltip, Flex } from '@mantine/core';
import { useExperimentStore } from '../../store/useExperimentStore';
import { Search, Home, FlaskConical, User, Moon, Sun, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { settings, updateSettings } = useExperimentStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: '首页', icon: Home },
    { path: '/profile', label: '个人中心', icon: User }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' });
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(12px)',
        background: settings.theme === 'light' 
          ? 'rgba(255, 255, 255, 0.85)' 
          : 'rgba(17, 24, 39, 0.85)',
        borderBottom: `1px solid ${settings.theme === 'light' ? '#E2E8F0' : '#374151'}`,
        height: '64px'
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', height: '100%' }}>
        <Flex justify="space-between" align="center" style={{ height: '100%' }}>
          <Group gap="md">
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Group gap="sm">
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #1E6FBA 0%, #2A8AE0 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(30, 111, 186, 0.3)'
                }}>
                  <FlaskConical size={22} color="#fff" />
                </div>
                <div>
                  <Text fw={700} size="lg" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                    ChemLab
                  </Text>
                  <Text size="xs" c="dimmed">化学实验模拟器</Text>
                </div>
              </Group>
            </Link>
          </Group>

          <Group gap="xs" visibleFrom="md">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Tooltip key={item.path} label={item.label} position="bottom">
                  <Link to={item.path} style={{ textDecoration: 'none' }}>
                    <ActionIcon
                      variant={active ? 'filled' : 'light'}
                      color="labBlue"
                      size="lg"
                      radius="md"
                      style={{
                        transition: 'all 0.2s ease',
                        transform: active ? 'scale(1.05)' : 'scale(1)'
                      }}
                    >
                      <Icon size={20} />
                    </ActionIcon>
                  </Link>
                </Tooltip>
              );
            })}
          </Group>

          <Group gap="sm">
            <Tooltip label="搜索实验" position="bottom">
              <ActionIcon variant="light" color="labBlue" size="lg" radius="md">
                <Search size={20} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={settings.theme === 'light' ? '切换深色模式' : '切换浅色模式'} position="bottom">
              <ActionIcon
                variant="light"
                color="labBlue"
                size="lg"
                radius="md"
                onClick={toggleTheme}
              >
                {settings.theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </ActionIcon>
            </Tooltip>
            <ActionIcon
              variant="light"
              color="labBlue"
              size="lg"
              radius="md"
              hiddenFrom="md"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </ActionIcon>
          </Group>
        </Flex>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          style={{
            background: settings.theme === 'light' ? '#fff' : '#111827',
            borderTop: `1px solid ${settings.theme === 'light' ? '#E2E8F0' : '#374151'}`,
            padding: '16px 24px'
          }}
        >
          <Flex direction="column" gap="sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ textDecoration: 'none' }}
                >
                  <Group
                    gap="sm"
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      background: active
                        ? (settings.theme === 'light' ? '#EFF6FF' : '#1E3A5F')
                        : 'transparent'
                    }}
                  >
                    <Icon size={20} color={active ? '#1E6FBA' : '#6B7280'} />
                    <Text
                      c={active ? 'labBlue' : 'dimmed'}
                      fw={active ? 600 : 400}
                    >
                      {item.label}
                    </Text>
                  </Group>
                </Link>
              );
            })}
          </Flex>
        </motion.div>
      )}
    </motion.header>
  );
};
