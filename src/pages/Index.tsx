import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const Index = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'starting' | 'stopping'>('online');
  
  const [cpuUsage, setCpuUsage] = useState(45);
  const [memoryUsage, setMemoryUsage] = useState(62);
  const [diskUsage] = useState(78);

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

  const [files] = useState([
    { name: 'server.properties', size: '2.4 KB', type: 'file', modified: '2024-12-18 14:32' },
    { name: 'world', size: '450 MB', type: 'folder', modified: '2024-12-18 15:20' },
    { name: 'plugins', size: '125 MB', type: 'folder', modified: '2024-12-18 10:15' },
    { name: 'logs', size: '15.6 MB', type: 'folder', modified: '2024-12-18 15:45' },
    { name: 'eula.txt', size: '156 B', type: 'file', modified: '2024-12-10 08:00' },
  ]);

  useEffect(() => {
    if (serverStatus === 'online') {
      const interval = setInterval(() => {
        setCpuUsage(prev => Math.min(100, Math.max(10, prev + (Math.random() - 0.5) * 10)));
        setMemoryUsage(prev => Math.min(100, Math.max(20, prev + (Math.random() - 0.5) * 5)));
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
      setConsoleLines(prev => [...prev, '[' + new Date().toLocaleTimeString() + '] Server started successfully']);
    }, 3000);
  };

  const handleStopServer = () => {
    setServerStatus('stopping');
    toast.info('Остановка сервера...');
    setTimeout(() => {
      setServerStatus('offline');
      toast.success('Сервер остановлен');
      setConsoleLines(prev => [...prev, '[' + new Date().toLocaleTimeString() + '] Server stopped']);
    }, 2000);
  };

  const handleRestartServer = () => {
    setServerStatus('stopping');
    toast.info('Перезагрузка сервера...');
    setTimeout(() => {
      setServerStatus('starting');
      setTimeout(() => {
        setServerStatus('online');
        toast.success('Сервер перезагружен!');
        setConsoleLines(prev => [...prev, '[' + new Date().toLocaleTimeString() + '] Server restarted']);
      }, 3000);
    }, 2000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Регистрация успешна! Проверьте почту для активации аккаунта.');
    setShowRegisterModal(false);
    setTimeout(() => {
      setActiveSection('dashboard');
    }, 1000);
  };

  const servers = [
    { id: 'srv-1', name: 'BisqVelocity', status: serverStatus, cpu: cpuUsage, memory: memoryUsage, disk: diskUsage, ip: 'bisqvit.mcdev.pol' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
                <Icon name="Server" size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold text-foreground">BiscuitHost</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => setActiveSection('home')}
                className={`text-sm font-medium transition-colors ${activeSection === 'home' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Главная
              </button>
              <button 
                onClick={() => setActiveSection('pricing')}
                className={`text-sm font-medium transition-colors ${activeSection === 'pricing' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Тарифы
              </button>
              <button 
                onClick={() => setActiveSection('docs')}
                className={`text-sm font-medium transition-colors ${activeSection === 'docs' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Документация
              </button>
              <button 
                onClick={() => setActiveSection('support')}
                className={`text-sm font-medium transition-colors ${activeSection === 'support' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Поддержка
              </button>
              <button 
                onClick={() => setActiveSection('dashboard')}
                className={`text-sm font-medium transition-colors ${activeSection === 'dashboard' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Панель
              </button>
            </nav>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">Войти</Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90">Регистрация</Button>
            </div>
          </div>
        </div>
      </header>

      {activeSection === 'home' && (
        <main>
          <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto text-center space-y-6">
                <Badge variant="secondary" className="px-4 py-1">
                  <Icon name="Zap" size={14} className="mr-2" />
                  Быстрый и надёжный хостинг
                </Badge>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  Хостинг нового <br />
                  <span className="text-primary">поколения</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Разверните свой проект за минуты. SSD-диски, защита от DDoS и техподдержка 24/7
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-lg px-8"
                    onClick={() => setShowRegisterModal(true)}
                  >
                    Начать бесплатно
                    <Icon name="ArrowRight" size={20} className="ml-2" />
                  </Button>
                  <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => setActiveSection('dashboard')}>
                    Смотреть демо
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: 'Gauge', title: 'Максимальная скорость', desc: 'NVMe SSD диски и оптимизированная инфраструктура для максимальной производительности' },
                { icon: 'Shield', title: 'Надёжная защита', desc: 'DDoS защита, SSL сертификаты и ежедневные бэкапы в стандартной комплектации' },
                { icon: 'HeadphonesIcon', title: 'Поддержка 24/7', desc: 'Наша команда экспертов всегда готова помочь решить любые технические вопросы' }
              ].map((feature, i) => (
                <Card key={i} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon name={feature.icon} size={24} className="text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </main>
      )}

      {activeSection === 'pricing' && (
        <section className="py-20 container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Выберите тариф</h2>
              <p className="text-xl text-muted-foreground">Гибкие решения для любых задач</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  name: 'Starter', 
                  price: '490', 
                  features: ['2 ГБ RAM', '20 ГБ SSD', '1 ТБ трафика', 'SSL сертификат', 'Базовая поддержка'],
                  highlight: false
                },
                { 
                  name: 'Pro', 
                  price: '1290', 
                  features: ['8 ГБ RAM', '100 ГБ SSD', '5 ТБ трафика', 'SSL сертификат', 'Приоритетная поддержка', 'Бесплатный домен'],
                  highlight: true
                },
                { 
                  name: 'Enterprise', 
                  price: '3990', 
                  features: ['32 ГБ RAM', '500 ГБ SSD', 'Безлимитный трафик', 'SSL сертификат', 'VIP поддержка 24/7', 'Бесплатный домен', 'Выделенный IP'],
                  highlight: false
                }
              ].map((plan, i) => (
                <Card key={i} className={`relative ${plan.highlight ? 'border-primary border-2 shadow-xl scale-105' : 'border-2'}`}>
                  {plan.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary px-4 py-1">Популярный</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground"> ₽/мес</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2">
                          <Icon name="Check" size={18} className="text-primary flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className={`w-full ${plan.highlight ? 'bg-primary' : ''}`} variant={plan.highlight ? 'default' : 'outline'}>
                      Выбрать тариф
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeSection === 'docs' && (
        <section className="py-20 container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h2 className="text-4xl font-bold mb-4">Документация</h2>
              <div className="relative">
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Поиск в документации..." className="pl-10" />
              </div>
            </div>

            <Tabs defaultValue="start" className="space-y-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="start">Начало работы</TabsTrigger>
                <TabsTrigger value="server">Серверы</TabsTrigger>
                <TabsTrigger value="domain">Домены</TabsTrigger>
                <TabsTrigger value="api">API</TabsTrigger>
              </TabsList>

              <TabsContent value="start" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Быстрый старт</CardTitle>
                    <CardDescription>Разверните свой первый сервер за 5 минут</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">1</div>
                        <div>
                          <h4 className="font-semibold mb-1">Создайте аккаунт</h4>
                          <p className="text-sm text-muted-foreground">Зарегистрируйтесь и подтвердите email</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">2</div>
                        <div>
                          <h4 className="font-semibold mb-1">Выберите тариф</h4>
                          <p className="text-sm text-muted-foreground">Подберите подходящую конфигурацию</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">3</div>
                        <div>
                          <h4 className="font-semibold mb-1">Разверните сервер</h4>
                          <p className="text-sm text-muted-foreground">Нажмите кнопку и сервер готов</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="server" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Управление серверами</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Как создать новый сервер?</AccordionTrigger>
                        <AccordionContent>
                          Перейдите в раздел "Серверы" и нажмите кнопку "Создать сервер". Выберите операционную систему, конфигурацию и регион размещения.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>Как подключиться по SSH?</AccordionTrigger>
                        <AccordionContent>
                          Используйте команду: ssh root@your-server-ip. Пароль отправлен на вашу почту при создании сервера.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>Как изменить тариф?</AccordionTrigger>
                        <AccordionContent>
                          В панели управления выберите нужный сервер, перейдите в настройки и выберите новую конфигурацию. Изменения вступят в силу в течение 5 минут.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="domain">
                <Card>
                  <CardHeader>
                    <CardTitle>Работа с доменами</CardTitle>
                    <CardDescription>Инструкции по настройке DNS и доменов</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Подробные руководства по привязке доменов, настройке DNS-записей и SSL-сертификатов.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="api">
                <Card>
                  <CardHeader>
                    <CardTitle>API документация</CardTitle>
                    <CardDescription>REST API для автоматизации управления</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Полное описание API методов для управления серверами, доменами и услугами программным способом.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      )}

      {activeSection === 'support' && (
        <section className="py-20 container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Поддержка</h2>
              <p className="text-xl text-muted-foreground">Мы всегда на связи</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon name="Mail" size={24} className="text-primary" />
                  </div>
                  <CardTitle>Email поддержка</CardTitle>
                  <CardDescription>support@biscuithost.ru</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Ответим в течение 2 часов</p>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon name="MessageCircle" size={24} className="text-primary" />
                  </div>
                  <CardTitle>Онлайн чат</CardTitle>
                  <CardDescription>Мгновенная помощь 24/7</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Открыть чат
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Отправить запрос</CardTitle>
                <CardDescription>Опишите вашу проблему и мы свяжемся с вами</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Имя</label>
                    <Input placeholder="Ваше имя" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="your@email.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Тема</label>
                  <Input placeholder="Кратко опишите проблему" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Сообщение</label>
                  <Textarea placeholder="Подробное описание..." rows={6} />
                </div>
                <Button className="w-full bg-primary">Отправить запрос</Button>
              </CardContent>
            </Card>

            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6">Частые вопросы</h3>
              <Accordion type="single" collapsible>
                <AccordionItem value="q1">
                  <AccordionTrigger>Как оплатить услуги?</AccordionTrigger>
                  <AccordionContent>
                    Мы принимаем банковские карты, PayPal, криптовалюту. Оплата проводится через защищенный платежный шлюз.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q2">
                  <AccordionTrigger>Есть ли бесплатный период?</AccordionTrigger>
                  <AccordionContent>
                    Да, мы предоставляем 7 дней бесплатного тестирования для всех новых клиентов на тарифе Starter.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q3">
                  <AccordionTrigger>Как часто делаются бэкапы?</AccordionTrigger>
                  <AccordionContent>
                    Автоматические бэкапы создаются ежедневно и хранятся 7 дней. На тарифах Pro и Enterprise доступны еженедельные архивы.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q4">
                  <AccordionTrigger>Можно ли перенести сайт с другого хостинга?</AccordionTrigger>
                  <AccordionContent>
                    Конечно! Наша техподдержка бесплатно поможет с переносом сайта. Просто создайте тикет после регистрации.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
      )}

      {activeSection === 'dashboard' && (
        <section className="py-20 container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-4xl font-bold mb-2">Панель управления</h2>
              <p className="text-muted-foreground">Управляйте вашими серверами и услугами</p>
            </div>

            <div className="space-y-6">
              {servers.map((server) => (
                <Card key={server.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon name="Server" size={24} className="text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{server.name}</CardTitle>
                          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                            <Icon name="Globe" size={14} />
                            {server.ip}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={server.status === 'online' ? 'default' : 'secondary'} 
                        className={
                          server.status === 'online' ? 'bg-green-500' : 
                          server.status === 'starting' ? 'bg-yellow-500' :
                          server.status === 'stopping' ? 'bg-orange-500' : 'bg-red-500'
                        }
                      >
                        {server.status === 'online' ? 'Онлайн' : 
                         server.status === 'starting' ? 'Запуск...' :
                         server.status === 'stopping' ? 'Остановка...' : 'Оффлайн'}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Обзор</TabsTrigger>
                        <TabsTrigger value="console">Консоль</TabsTrigger>
                        <TabsTrigger value="files">Файлы</TabsTrigger>
                        <TabsTrigger value="monitoring">Мониторинг</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-6">
                        <div className="flex gap-3">
                          <Button 
                            onClick={handleStartServer} 
                            disabled={server.status === 'online' || server.status === 'starting'}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Icon name="Play" size={16} className="mr-2" />
                            Старт
                          </Button>
                          <Button 
                            onClick={handleStopServer}
                            disabled={server.status === 'offline' || server.status === 'stopping'}
                            variant="destructive"
                          >
                            <Icon name="Square" size={16} className="mr-2" />
                            Стоп
                          </Button>
                          <Button 
                            onClick={handleRestartServer}
                            disabled={server.status !== 'online'}
                            variant="outline"
                          >
                            <Icon name="RotateCw" size={16} className="mr-2" />
                            Перезагрузка
                          </Button>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium flex items-center justify-between">
                                Использование ЦП
                                <Icon name="Cpu" size={16} className="text-muted-foreground" />
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">{cpuUsage.toFixed(1)}%</div>
                              <div className="w-full bg-muted rounded-full h-2 mt-2">
                                <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${cpuUsage}%` }} />
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium flex items-center justify-between">
                                Память
                                <Icon name="Database" size={16} className="text-muted-foreground" />
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">{memoryUsage.toFixed(1)}%</div>
                              <div className="w-full bg-muted rounded-full h-2 mt-2">
                                <div className="bg-orange-500 h-2 rounded-full transition-all" style={{ width: `${memoryUsage}%` }} />
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium flex items-center justify-between">
                                Диск
                                <Icon name="HardDrive" size={16} className="text-muted-foreground" />
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">{diskUsage}%</div>
                              <div className="w-full bg-muted rounded-full h-2 mt-2">
                                <div className="bg-secondary h-2 rounded-full transition-all" style={{ width: `${diskUsage}%` }} />
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      <TabsContent value="console">
                        <Card className="bg-black/95 border-gray-800">
                          <CardHeader className="border-b border-gray-800 flex flex-row items-center justify-between pb-3">
                            <CardTitle className="text-green-400 text-sm font-mono">Консоль</CardTitle>
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost" className="h-7 text-gray-400 hover:text-white">
                                <Icon name="Copy" size={14} />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-7 text-gray-400 hover:text-white"
                                onClick={() => navigate('/console')}
                              >
                                <Icon name="Maximize2" size={14} className="mr-2" />
                                Полный экран
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="p-0">
                            <ScrollArea className="h-[400px] p-4">
                              <div className="space-y-1 font-mono text-xs">
                                {consoleLines.map((line, i) => (
                                  <div key={i} className="text-gray-300">
                                    {line}
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                            <div className="border-t border-gray-800 p-3 flex gap-2">
                              <Input 
                                placeholder="Введите команду..." 
                                className="bg-black/50 border-gray-700 text-white font-mono text-sm"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && e.currentTarget.value) {
                                    setConsoleLines(prev => [...prev, '> ' + e.currentTarget.value]);
                                    e.currentTarget.value = '';
                                  }
                                }}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="files">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              <span>Файловый менеджер</span>
                              <Button size="sm" variant="outline">
                                <Icon name="Upload" size={16} className="mr-2" />
                                Загрузить
                              </Button>
                            </CardTitle>
                            <CardDescription>Управление файлами сервера</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {files.map((file, i) => (
                                <div 
                                  key={i} 
                                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                      <Icon 
                                        name={file.type === 'folder' ? 'Folder' : 'FileText'} 
                                        size={20} 
                                        className="text-primary" 
                                      />
                                    </div>
                                    <div>
                                      <p className="font-medium">{file.name}</p>
                                      <p className="text-xs text-muted-foreground">{file.size} • {file.modified}</p>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="ghost">
                                      <Icon name="Download" size={16} />
                                    </Button>
                                    <Button size="sm" variant="ghost">
                                      <Icon name="MoreVertical" size={16} />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="monitoring">
                        <div className="grid gap-6">
                          <Card>
                            <CardHeader>
                              <CardTitle>Мониторинг в реальном времени</CardTitle>
                              <CardDescription>Метрики производительности сервера</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium">Процессор</span>
                                  <span className="text-sm text-muted-foreground">{cpuUsage.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-3">
                                  <div 
                                    className="bg-gradient-to-r from-primary to-orange-500 h-3 rounded-full transition-all duration-500" 
                                    style={{ width: `${cpuUsage}%` }} 
                                  />
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium">Оперативная память</span>
                                  <span className="text-sm text-muted-foreground">{memoryUsage.toFixed(1)}% • 706.43 МБ / 2 ГБ</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-3">
                                  <div 
                                    className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500" 
                                    style={{ width: `${memoryUsage}%` }} 
                                  />
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium">Дисковое пространство</span>
                                  <span className="text-sm text-muted-foreground">{diskUsage}% • 174.17 МБ / 2 ГБ</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-3">
                                  <div 
                                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all" 
                                    style={{ width: `${diskUsage}%` }} 
                                  />
                                </div>
                              </div>

                              <div className="pt-4 border-t">
                                <h4 className="font-semibold mb-3">Подключение</h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">IP адрес:</span>
                                    <span className="font-mono">{server.ip}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Порт:</span>
                                    <span className="font-mono">25565</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Время работы:</span>
                                    <span>5 час. 34 мин.</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="border-t bg-muted/30 mt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
                  <Icon name="Server" size={18} className="text-white" />
                </div>
                <span className="text-xl font-bold">BiscuitHost</span>
              </div>
              <p className="text-sm text-muted-foreground">Надёжный хостинг для ваших проектов</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Продукты</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Виртуальный хостинг</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">VPS серверы</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Выделенные серверы</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Домены</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">О нас</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Блог</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Вакансии</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Партнёры</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Связь</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>support@biscuithost.ru</li>
                <li>+7 (495) 123-45-67</li>
                <li className="flex gap-3 pt-2">
                  <a href="#" className="hover:text-primary transition-colors">
                    <Icon name="Github" size={20} />
                  </a>
                  <a href="#" className="hover:text-primary transition-colors">
                    <Icon name="Twitter" size={20} />
                  </a>
                  <a href="#" className="hover:text-primary transition-colors">
                    <Icon name="Linkedin" size={20} />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 BiscuitHost. Все права защищены.
          </div>
        </div>
      </footer>

      <Dialog open={showRegisterModal} onOpenChange={setShowRegisterModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Регистрация</DialogTitle>
            <DialogDescription>
              Создайте аккаунт и получите 7 дней бесплатного тестирования
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Имя</label>
              <Input placeholder="Ваше имя" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="email@example.com" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Пароль</label>
              <Input type="password" placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full bg-primary">
              Зарегистрироваться
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;