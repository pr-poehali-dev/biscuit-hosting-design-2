import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Console = () => {
  const navigate = useNavigate();
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'starting' | 'stopping'>('online');
  const [cpuUsage, setCpuUsage] = useState(0.58);
  const [memoryUsage, setMemoryUsage] = useState(706.43);
  const [diskUsage, setDiskUsage] = useState(174.17);
  const [consoleLines, setConsoleLines] = useState([
    '[00:14:22.080] [Server thread/INFO]: Starting Minecraft server version 1.20.1',
    '[00:14:22.082] [Server thread/INFO]: Loading properties',
    '[00:14:22.089] [Server thread/INFO]: Default game type: SURVIVAL',
    '[00:14:22.089] [Server thread/INFO]: Generating keypair',
    '[00:14:22.490] [Server thread/INFO]: Starting Minecraft server on *:25565',
    '[00:14:22.491] [Server thread/INFO]: Using default channel type',
    '[00:14:23.178] [Server thread/INFO]: Preparing level "world"',
    '[00:14:25.891] [Server thread/INFO]: Preparing start region for dimension minecraft:overworld',
    '[00:14:26.392] [Server thread/INFO]: Time elapsed: 501 ms',
    '[00:14:26.393] [Server thread/INFO]: Done (4.202s)! For help, type "help"',
  ]);
  const [commandInput, setCommandInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [consoleLines]);

  useEffect(() => {
    if (serverStatus === 'online') {
      const interval = setInterval(() => {
        setCpuUsage(prev => Math.min(1000, Math.max(0.1, prev + (Math.random() - 0.5) * 0.3)));
        setMemoryUsage(prev => Math.min(2000, Math.max(100, prev + (Math.random() - 0.5) * 20)));
        setDiskUsage(prev => Math.min(2000, Math.max(50, prev + (Math.random() - 0.5) * 5)));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [serverStatus]);

  const handleStartServer = () => {
    setServerStatus('starting');
    toast.info('Запуск сервера...');
    setTimeout(() => {
      setServerStatus('online');
      toast.success('Сервер успешно запущен!');
      setConsoleLines(prev => [...prev, '[' + new Date().toLocaleTimeString() + '] [Server thread/INFO]: Server started successfully']);
    }, 3000);
  };

  const handleStopServer = () => {
    setServerStatus('stopping');
    toast.info('Остановка сервера...');
    setTimeout(() => {
      setServerStatus('offline');
      toast.success('Сервер остановлен');
      setConsoleLines(prev => [...prev, '[' + new Date().toLocaleTimeString() + '] [Server thread/INFO]: Stopping the server']);
      setConsoleLines(prev => [...prev, '[' + new Date().toLocaleTimeString() + '] [Server thread/INFO]: Saving worlds']);
      setConsoleLines(prev => [...prev, '[' + new Date().toLocaleTimeString() + '] [Server thread/INFO]: Server stopped']);
    }, 2000);
  };

  const handleRestartServer = () => {
    setServerStatus('stopping');
    toast.info('Перезагрузка сервера...');
    setConsoleLines(prev => [...prev, '[' + new Date().toLocaleTimeString() + '] [Server thread/INFO]: Server restart initiated']);
    setTimeout(() => {
      setServerStatus('starting');
      setTimeout(() => {
        setServerStatus('online');
        toast.success('Сервер перезагружен!');
        setConsoleLines(prev => [...prev, '[' + new Date().toLocaleTimeString() + '] [Server thread/INFO]: Server restarted successfully']);
      }, 3000);
    }, 2000);
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    
    setConsoleLines(prev => [...prev, '> ' + commandInput]);
    
    if (commandInput.toLowerCase() === 'help') {
      setConsoleLines(prev => [...prev, '[' + new Date().toLocaleTimeString() + '] Available commands: help, list, stop, version']);
    } else if (commandInput.toLowerCase() === 'list') {
      setConsoleLines(prev => [...prev, '[' + new Date().toLocaleTimeString() + '] There are 0 of a max of 20 players online:']);
    } else if (commandInput.toLowerCase() === 'version') {
      setConsoleLines(prev => [...prev, '[' + new Date().toLocaleTimeString() + '] This server is running Minecraft version 1.20.1']);
    } else {
      setConsoleLines(prev => [...prev, '[' + new Date().toLocaleTimeString() + '] Command executed: ' + commandInput]);
    }
    
    setCommandInput('');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <aside className="w-64 bg-[#1a1a1a] border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
              <Icon name="Server" size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white">BiscuitHost</h2>
              <p className="text-xs text-gray-400">Панель управления</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4">
          <div className="space-y-1 mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Основное</h3>
            <button 
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 transition-colors"
            >
              <Icon name="LayoutDashboard" size={18} />
              Обзор
            </button>
            <button 
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm bg-primary/20 text-primary"
            >
              <Icon name="Terminal" size={18} />
              Консоль
            </button>
            <button 
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  const dashboard = document.querySelector('[data-section="dashboard"]');
                  if (dashboard) dashboard.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 transition-colors"
            >
              <Icon name="Files" size={18} />
              Файлы
            </button>
          </div>

          <div className="space-y-1 mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Управление</h3>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 transition-colors">
              <Icon name="Database" size={18} />
              База Данных
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 transition-colors">
              <Icon name="FolderOpen" size={18} />
              Бэкапы
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 transition-colors">
              <Icon name="Users" size={18} />
              Пользователи
            </button>
          </div>

          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Minecraft</h3>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 transition-colors">
              <Icon name="Boxes" size={18} />
              Конфигурация
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 transition-colors">
              <Icon name="Package" size={18} />
              Версии
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 transition-colors">
              <Icon name="UserCircle" size={18} />
              Аккаунт
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-gray-800">
          <Button 
            onClick={() => navigate('/')}
            variant="outline" 
            className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            <Icon name="Home" size={16} className="mr-2" />
            Вернуться
          </Button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="bg-[#1a1a1a] border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Icon name="Terminal" size={24} className="text-primary" />
                  Консоль
                </h1>
                <p className="text-sm text-gray-400 mt-1">BisqVelocity • 5.81.189.207:25565</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                onClick={handleStartServer} 
                disabled={serverStatus === 'online' || serverStatus === 'starting'}
                size="sm"
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                <Icon name="Play" size={16} className="mr-2" />
                Старт
              </Button>
              <Button 
                onClick={handleStopServer}
                disabled={serverStatus === 'offline' || serverStatus === 'stopping'}
                size="sm"
                variant="destructive"
              >
                <Icon name="Square" size={16} className="mr-2" />
                Стоп
              </Button>
              <Button 
                onClick={handleRestartServer}
                disabled={serverStatus !== 'online'}
                size="sm"
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Icon name="RotateCw" size={16} className="mr-2" />
                Перезагрузка
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm text-gray-400">Использование Процессора</CardTitle>
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Icon name="Cpu" size={20} className="text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{cpuUsage.toFixed(2)}%</div>
                <p className="text-xs text-gray-500 mt-1">/ 1000%</p>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm text-gray-400">Использование Памяти</CardTitle>
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Icon name="Database" size={20} className="text-orange-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{memoryUsage.toFixed(2)} МБ</div>
                <p className="text-xs text-gray-500 mt-1">/ 2 ГБ</p>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm text-gray-400">Файловое / Резервное копирование</CardTitle>
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <Icon name="HardDrive" size={20} className="text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{diskUsage.toFixed(2)} МБ</div>
                <p className="text-xs text-gray-500 mt-1">/ 17T1 МБ</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-black/95 border-gray-800 flex-1">
            <CardHeader className="border-b border-gray-800 flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <Icon name="Terminal" size={18} className="text-green-400" />
                <CardTitle className="text-green-400 text-sm font-mono">Консоль</CardTitle>
                <Badge 
                  className={
                    serverStatus === 'online' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 
                    serverStatus === 'starting' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                    serverStatus === 'stopping' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 
                    'bg-red-500/20 text-red-400 border-red-500/30'
                  }
                >
                  {serverStatus === 'online' ? 'Онлайн' : 
                   serverStatus === 'starting' ? 'Запуск...' :
                   serverStatus === 'stopping' ? 'Остановка...' : 'Оффлайн'}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" className="h-8 text-gray-400 hover:text-white hover:bg-gray-800">
                  <Icon name="Copy" size={14} className="mr-2" />
                  Копировать
                </Button>
                <Button size="sm" variant="ghost" className="h-8 text-gray-400 hover:text-white hover:bg-gray-800">
                  <Icon name="Download" size={14} className="mr-2" />
                  Скачать логи
                </Button>
                <Button size="sm" variant="ghost" className="h-8 text-gray-400 hover:text-white hover:bg-gray-800">
                  <Icon name="Maximize2" size={14} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div 
                ref={scrollRef}
                className="h-[calc(100vh-400px)] overflow-y-auto p-4 font-mono text-xs"
              >
                <div className="space-y-1">
                  {consoleLines.map((line, i) => (
                    <div key={i} className="text-gray-300 leading-relaxed">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
              <form onSubmit={handleCommand} className="border-t border-gray-800 p-3 flex gap-2 bg-[#0a0a0a]">
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-green-400 font-mono text-sm">$</span>
                  <Input 
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    placeholder="Введите команду..." 
                    className="bg-transparent border-none text-white font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                    disabled={serverStatus !== 'online'}
                  />
                </div>
                <Button 
                  type="submit"
                  size="sm" 
                  className="bg-primary hover:bg-primary/90"
                  disabled={serverStatus !== 'online'}
                >
                  Отправить
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Console;
