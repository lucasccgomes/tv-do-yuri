import { Video, VideoFolder } from '@/types';
import { mapVideoUrl } from './videoUrl';

// Desenhos animados
const cartoonVideos: Video[] = [
  {
    id: 'osvegetais-001',
    title: 'Os Vegetais As Últimas Canções Divertidas',
    category: 'cartoon',
    duration: 2020,
    endAt: 2020,
    ageRecommendation: 'all',
    educationalValue: 'Estimula valores morais e espirituais, como respeito, honestidade e solidariedade, por meio de músicas e histórias curtas que ajudam a desenvolver empatia e compreensão dos bons comportamentos.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/osvegetais/os-vegetais-as-ultimas-cancoes-divertidas.mp4',
    thumbnail: 'https://univideo01.akamaized.net/cdn/asset/images/L1_DESKTOP-UiFoA.jpg',
    description: 'Um episódio musical da série Os Vegetais que reúne as últimas canções engraçadas e educativas, apresentando mensagens sobre amizade, bondade e fé de forma leve e divertida para todas as idades.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language', 'motor_skills']
  },
  {
    id: 'osvegetais-002',
    title: 'Os Vegetais Rei George e Ester',
    category: 'cartoon',
    duration: 4529,
    endAt: 4529,
    ageRecommendation: '4-5',
    educationalValue: 'Ensina valores fundamentais como empatia, generosidade, coragem e responsabilidade. As histórias reforçam a importância de pensar no bem coletivo, desenvolver fé e tomar decisões éticas mesmo em situações difíceis.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/osvegetais/osvegetais.mp4',
    thumbnail: 'https://univideo01.akamaized.net/cdn/asset/images/L1_DESKTOP-UiFoA.jpg',
    description: 'Episódio especial de Os Vegetais que traz duas histórias inspiradas na Bíblia: o Rei George aprende sobre generosidade e humildade, enquanto Ester mostra coragem e fé para defender seu povo. Ambas são contadas com humor e músicas envolventes, ideais para crianças e toda a família.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language',]
  },
  {
    id: 'osvegetais-003',
    title: 'Os Vegetais Rei George e Ester-2',
    category: 'cartoon',
    duration: 2181,
    endAt: 2181,
    ageRecommendation: '4-5',
    educationalValue: 'Ensina valores fundamentais como empatia, generosidade, coragem e responsabilidade. As histórias reforçam a importância de pensar no bem coletivo, desenvolver fé e tomar decisões éticas mesmo em situações difíceis.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/osvegetais/osvegetais4.mp4',
    thumbnail: 'https://univideo01.akamaized.net/cdn/asset/images/L1_DESKTOP-UiFoA.jpg',
    description: 'Episódio especial de Os Vegetais que traz duas histórias inspiradas na Bíblia: o Rei George aprende sobre generosidade e humildade, enquanto Ester mostra coragem e fé para defender seu povo. Ambas são contadas com humor e músicas envolventes, ideais para crianças e toda a família.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language',]
  },
  {
    id: 'osvegetais-004',
    title: 'Os Vegetais Rei George e Ester-3',
    category: 'cartoon',
    duration: 2348,
    endAt: 2348,
    ageRecommendation: '4-5',
    educationalValue: 'Ensina valores fundamentais como empatia, generosidade, coragem e responsabilidade. As histórias reforçam a importância de pensar no bem coletivo, desenvolver fé e tomar decisões éticas mesmo em situações difíceis.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/osvegetais/osvegetais5.mp4',
    thumbnail: 'https://univideo01.akamaized.net/cdn/asset/images/L1_DESKTOP-UiFoA.jpg',
    description: 'Episódio especial de Os Vegetais que traz duas histórias inspiradas na Bíblia: o Rei George aprende sobre generosidade e humildade, enquanto Ester mostra coragem e fé para defender seu povo. Ambas são contadas com humor e músicas envolventes, ideais para crianças e toda a família.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language',]
  },











  {
    id: 'artur-001',
    title: 'Os Óculos de Arthur / O Penteado de Francine (1996)',
    category: 'cartoon',
    duration: 1479,
    endAt: 1450,
    ageRecommendation: '4-5',
    educationalValue: 'Ajuda crianças a compreenderem temas como aceitação das diferenças (no caso dos óculos), autoestima e pressão de grupo (com o penteado de Francine). Além disso, promove diálogo sobre amizade, respeito e imaginar consequências das escolhas de aparência e identidade.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/artur/arthur-os-oculos-de-arthur-o-penteado-de-francine-1996.mp4',
    thumbnail: 'https://arthur.fandom.com/wiki/File:1996-09-02_-_Arthur_-_1x01b-Francine%27s_Bad_Hair_Day_2210_(3-500).png',
    description: 'Neste episódio duplo da série “Arthur”, primeiro Arthur aprende a conviver com os óculos e o que isso muda em sua rotina. Em seguida, Francine enfrenta a pressão de ter um novo visual para o “Dia da Foto” na escola, questionando o que realmente importa na aparência e no valor da amizade.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },






  {
    id: 'bluey-001',
    title: 'Bluey – Temporada 1 Episódio 1',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Promove o aprendizado através do brincar, estimulando a imaginação, a socialização, a resolução de problemas e boas práticas de convivência familiar. A série evidencia como adultos e crianças podem interagir de forma lúdica e respeitosa, fortalecendo vínculos e habilidades socioemocionais.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-1.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey e Bingo transformam o quintal em um mundo mágico de aventuras, mostrando como a brincadeira é uma poderosa forma de aprendizado.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-002',
    title: 'Bluey – Temporada 1 Episódio 2',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Estimula a imaginação e a criatividade, mostrando o valor do trabalho em equipe e da escuta ativa nas brincadeiras familiares.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-2.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Durante uma brincadeira de faz de conta, Bluey e Bingo aprendem a importância de cooperar e respeitar as regras do jogo.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-003',
    title: 'Bluey – Temporada 1 Episódio 3',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Incentiva a resolução de conflitos e o desenvolvimento emocional por meio do diálogo e da empatia.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-3.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey e seus amigos encenam uma peça onde cada um precisa aprender a ouvir e compreender o ponto de vista do outro.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-004',
    title: 'Bluey – Temporada 1 Episódio 4',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Fortalece valores familiares e mostra como o brincar conjunto aproxima pais e filhos.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-4.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey descobre que brincar com os pais pode ser ainda mais divertido quando todos participam e criam juntos.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-005',
    title: 'Bluey – Temporada 1 Episódio 5',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Mostra a importância de aprender com os erros e persistir nos desafios diários.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-5.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Durante uma competição divertida, Bluey entende que perder faz parte do aprendizado e que tentar novamente é o que conta.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-006',
    title: 'Bluey – Temporada 1 Episódio 6',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Ensina empatia e solidariedade por meio de situações cotidianas.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-6.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Quando um amigo fica triste, Bluey e Bingo aprendem a importância de oferecer ajuda e carinho.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-007',
    title: 'Bluey – Temporada 1 Episódio 7',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Desenvolve o pensamento criativo e a capacidade de resolver problemas através da imaginação.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-7.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Uma simples caixa se transforma em um foguete, mostrando que a imaginação pode levar as crianças a qualquer lugar.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-008',
    title: 'Bluey – Temporada 1 Episódio 8',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Trabalha paciência e comunicação, reforçando o respeito durante as brincadeiras em grupo.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-8.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey e Bingo precisam esperar a vez em um jogo divertido, aprendendo a lidar com a ansiedade e o respeito mútuo.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-009',
    title: 'Bluey – Temporada 1 Episódio 9',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Mostra como a cooperação e o afeto constroem amizades duradouras.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-9.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey e Bingo ajudam um novo amigo a se adaptar na escola e aprendem o poder da inclusão.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-010',
    title: 'Bluey – Temporada 1 Episódio 10',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Fomenta o equilíbrio entre imaginação e responsabilidade durante as brincadeiras.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-10.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Durante um jogo de faz de conta, Bluey percebe que suas decisões afetam os outros e aprende sobre responsabilidade.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-011',
    title: 'Bluey – Temporada 1 Episódio 11',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Ensina a importância da paciência e da colaboração durante desafios em família e nas brincadeiras.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-11.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey e Bingo tentam montar um brinquedo complicado com o pai e aprendem que trabalhar juntos é o segredo do sucesso.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-012',
    title: 'Bluey – Temporada 1 Episódio 12',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Estimula a imaginação e a resolução de problemas em situações de faz-de-conta.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-12.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey transforma a sala em um consultório veterinário e descobre a alegria de cuidar dos outros.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-013',
    title: 'Bluey – Temporada 1 Episódio 13',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Ajuda as crianças a reconhecer emoções e desenvolver empatia ao lidar com sentimentos diferentes.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-13.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey aprende a identificar quando está triste e como o apoio da família pode ajudar a superar os momentos difíceis.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-014',
    title: 'Bluey – Temporada 1 Episódio 14',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Reforça a importância da honestidade e do reconhecimento dos próprios erros.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-14.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Durante uma brincadeira, Bluey tenta esconder um erro e descobre o valor de dizer a verdade.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-015',
    title: 'Bluey – Temporada 1 Episódio 15',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Desenvolve habilidades de comunicação e trabalho em equipe durante atividades lúdicas.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-15.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey e Bingo criam um programa de TV imaginário e aprendem a dividir funções e respeitar ideias diferentes.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-016',
    title: 'Bluey – Temporada 1 Episódio 16',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Trabalha controle emocional e paciência, mostrando o valor de esperar o momento certo.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-16.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Enquanto esperam uma visita chegar, Bluey e Bingo aprendem a lidar com a ansiedade e a ocupar o tempo de forma divertida.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-017',
    title: 'Bluey – Temporada 1 Episódio 17',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Mostra o valor da imaginação coletiva e do brincar em grupo para o desenvolvimento social.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-17.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey e seus amigos inventam um jogo novo no parquinho e aprendem a lidar com opiniões diferentes.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-018',
    title: 'Bluey – Temporada 1 Episódio 18',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Incentiva o autocontrole e o respeito durante as brincadeiras competitivas.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-18.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey e Bingo competem em uma corrida e aprendem que o mais importante é se divertir e apoiar um ao outro.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-019',
    title: 'Bluey – Temporada 1 Episódio 19',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Estimula empatia e o reconhecimento das emoções nas interações familiares.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-19.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey percebe que o pai está cansado e decide ajudá-lo, mostrando carinho e empatia.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-020',
    title: 'Bluey – Temporada 1 Episódio 20',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Reforça a importância da imaginação e da curiosidade como ferramentas de aprendizado.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-20.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey e Bingo criam uma expedição no quintal e descobrem que a curiosidade pode transformar qualquer dia em uma grande aventura.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-021',
    title: 'Bluey – Temporada 1 Episódio 21',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Ensina sobre generosidade e partilha, mostrando como dividir brinquedos e tempo fortalece laços de amizade.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-21.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey e Bingo aprendem que compartilhar seus brinquedos torna a brincadeira mais divertida para todos.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-022',
    title: 'Bluey – Temporada 1 Episódio 22',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Trabalha a autoestima e a valorização das próprias qualidades, incentivando a autoconfiança.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-22.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey tenta copiar um amigo, mas descobre que ser ela mesma é o que a torna especial.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-023',
    title: 'Bluey – Temporada 1 Episódio 23',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Mostra a importância da cooperação e do respeito durante brincadeiras em grupo.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-23.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Durante um jogo de construção, Bluey aprende que ouvir ideias diferentes torna o resultado melhor.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-024',
    title: 'Bluey – Temporada 1 Episódio 24',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Explora empatia e compreensão das emoções de amigos e familiares.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-24.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey percebe que sua irmã ficou triste durante uma brincadeira e aprende a importância de se colocar no lugar do outro.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-025',
    title: 'Bluey – Temporada 1 Episódio 25',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Estimula a imaginação e o pensamento simbólico, mostrando como o faz-de-conta ajuda a aprender.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-25.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey transforma o sofá em um navio pirata e descobre novas formas de brincar usando objetos simples.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-026',
    title: 'Bluey – Temporada 1 Episódio 26',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Reforça valores familiares e o papel do respeito e do amor dentro de casa.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-26.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Durante um jantar em família, Bluey percebe que ajudar e ouvir os pais torna os momentos juntos ainda melhores.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-027',
    title: 'Bluey – Temporada 1 Episódio 27',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Trabalha resolução de conflitos e empatia entre irmãos.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-27.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey e Bingo discutem durante uma brincadeira e aprendem a resolver o problema conversando e pedindo desculpas.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-028',
    title: 'Bluey – Temporada 1 Episódio 28',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Fomenta o aprendizado sobre regras e limites de forma leve e educativa.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-28.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Durante um jogo de esconde-esconde, Bluey entende a importância de respeitar as regras para que todos se divirtam.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-029',
    title: 'Bluey – Temporada 1 Episódio 29',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Desenvolve atenção, observação e coordenação motora fina em atividades práticas.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-29.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey e o pai preparam um lanche especial e descobrem como seguir instruções pode ser divertido.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-030',
    title: 'Bluey – Temporada 1 Episódio 30',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Estimula a curiosidade científica e o desejo de explorar o mundo ao redor.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-30.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey e Bingo fazem experimentos simples e aprendem que errar faz parte do processo de descoberta.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },

  {
    id: 'bluey-031',
    title: 'Bluey – Temporada 1 Episódio 31',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Ensina a importância de cuidar dos animais e respeitar a natureza de forma divertida.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-31.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey e Bingo encontram um passarinho ferido e aprendem a cuidar dele com paciência e carinho.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-032',
    title: 'Bluey – Temporada 1 Episódio 32',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Estimula a colaboração familiar e o senso de responsabilidade nas pequenas tarefas do dia a dia.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-32.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey ajuda a mãe nas tarefas de casa e descobre como trabalhar em equipe torna tudo mais leve.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-033',
    title: 'Bluey – Temporada 1 Episódio 33',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Fomenta o pensamento lógico e a criatividade na solução de desafios simples.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-33.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Durante um quebra-cabeça, Bluey aprende que resolver problemas é mais fácil com paciência e foco.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-034',
    title: 'Bluey – Temporada 1 Episódio 34',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Trabalha o controle emocional e o respeito pelas diferenças de opinião.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-34.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey discorda de Bingo em uma brincadeira e aprende que ceder também faz parte da amizade.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-035',
    title: 'Bluey – Temporada 1 Episódio 35',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Estimula o desenvolvimento motor e a coordenação em brincadeiras ativas.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-35.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey participa de um jogo de pega-pega e descobre o prazer do movimento e da cooperação.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-036',
    title: 'Bluey – Temporada 1 Episódio 36',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Mostra a importância da empatia e da paciência com os mais novos.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-36.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey ajuda uma criança menor a brincar e aprende a ser gentil e compreensiva.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-037',
    title: 'Bluey – Temporada 1 Episódio 37',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Promove o aprendizado sobre tempo e rotina, ajudando crianças a se organizarem melhor.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-37.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey aprende sobre horários ao tentar organizar o dia para brincar, descansar e ajudar os pais.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-038',
    title: 'Bluey – Temporada 1 Episódio 38',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Estimula a imaginação e o pensamento simbólico por meio do jogo de papéis.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-38.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey e Bingo brincam de escola e aprendem sobre responsabilidade e empatia com os “alunos imaginários”.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-039',
    title: 'Bluey – Temporada 1 Episódio 39',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Desenvolve paciência e perseverança diante de tarefas desafiadoras.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-39.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey tenta aprender a amarrar os sapatos e descobre que com prática e calma é possível dominar qualquer desafio.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-040',
    title: 'Bluey – Temporada 1 Episódio 40',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Reforça o valor da amizade e da gratidão em momentos simples do cotidiano.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-40.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey e Bingo organizam uma surpresa para um amigo e aprendem o quanto é bom fazer alguém sorrir.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },


  {
    id: 'bluey-041',
    title: 'Bluey – Temporada 1 Episódio 41',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Mostra a importância de pedir desculpas e reconhecer quando erramos, fortalecendo vínculos afetivos.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-41.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Após uma brincadeira que sai do controle, Bluey aprende que pedir desculpas é um ato de coragem e amor.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-042',
    title: 'Bluey – Temporada 1 Episódio 42',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Estimula a observação e a curiosidade científica por meio de explorações ao ar livre.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-42.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey e Bingo saem para explorar o jardim e descobrem insetos, plantas e novas formas de ver o mundo.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-043',
    title: 'Bluey – Temporada 1 Episódio 43',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Trabalha resiliência e superação diante de frustrações em atividades do dia a dia.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-43.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey tenta andar de bicicleta sozinha e aprende que cair faz parte do processo de aprender.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-044',
    title: 'Bluey – Temporada 1 Episódio 44',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Reforça o senso de empatia e o cuidado entre irmãos e amigos.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-44.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Quando Bingo fica doente, Bluey descobre novas formas de demonstrar carinho e ajudar quem precisa.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-045',
    title: 'Bluey – Temporada 1 Episódio 45',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Mostra como o trabalho em equipe ajuda a atingir objetivos comuns em brincadeiras e tarefas.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-45.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey e Bingo constroem uma fortaleza de almofadas e percebem que cooperar é mais divertido do que competir.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-046',
    title: 'Bluey – Temporada 1 Episódio 46',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Explora o poder da imaginação na resolução de problemas e criação de histórias.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-46.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey inventa um mundo de fantasia onde cada personagem tem um papel importante na aventura.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-047',
    title: 'Bluey – Temporada 1 Episódio 47',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Mostra como lidar com mudanças e se adaptar a novas situações de forma positiva.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-47.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Quando uma amiga se muda, Bluey aprende que mesmo à distância as amizades continuam especiais.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-048',
    title: 'Bluey – Temporada 1 Episódio 48',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Ensina o valor da responsabilidade e da persistência ao cuidar de tarefas pessoais.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-48.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey ganha a missão de cuidar de uma planta e aprende sobre paciência e compromisso.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-049',
    title: 'Bluey – Temporada 1 Episódio 49',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Trabalha autoestima e confiança ao enfrentar situações novas.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-49.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey participa de uma apresentação na escola e descobre como vencer o medo de se apresentar em público.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-050',
    title: 'Bluey – Temporada 1 Episódio 50',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Reforça valores de amizade, respeito e celebração das diferenças.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-50.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'Bluey faz novos amigos na escola e percebe como cada um tem algo único para compartilhar.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },
  {
    id: 'bluey-051',
    title: 'Bluey – Temporada 1 Episódio 51',
    category: 'cartoon',
    duration: 438,
    endAt: 438,
    ageRecommendation: '4-5',
    educationalValue: 'Mostra a importância da união familiar, da empatia e do amor em momentos simples do cotidiano.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/bluey-t1/bluey-t1-51.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Bluey_title_card.jpg',
    description: 'No último episódio da temporada, Bluey e sua família relembram brincadeiras e momentos especiais, celebrando o valor do convívio e da alegria.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  },










  {
    id: 'george-001',
    title: 'George – Aventuras no Mar',
    category: 'cartoon',
    duration: 5319,            // estimativa ~85 min → 5100 segundos :contentReference[oaicite:1]{index=1}
    endAt: 5100,
    ageRecommendation: '4-5',
    educationalValue: 'Estimula a curiosidade, o espírito de aventura e o amor pela natureza através da missão de George em ajudar na busca a um naufrágio submarino. Ensina resolução de problemas, empatia e trabalho em equipe.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/cartoons/george/george-o-curioso-aventuras-no-mar.mp4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/…/Curious_George_Cape_Ahoy_poster.jpg',  // exemplo de capa
    description: 'No filme, George embarca numa aventura no mar ao lado de um pescador, sua sobrinha e uma foca bebé, explorando naufrágios, vida marinha e descobertas inesperadas — tudo com muito humor e aprendizagem.',
    skills: ['cognitive', 'socioemotional', 'creativity', 'language']
  }

];














// Clipes educativos
const educationalClips: Video[] = [
  {
    id: 'edu-monica-001',
    title: 'Turma da Mônica – Aprendendo o ABC',
    category: 'educational_clip',
    duration: 156,
    ageRecommendation: 'all',
    educationalValue: 'Ensina o alfabeto de forma divertida com os personagens da Turma da Mônica, incentivando a pronúncia correta e o reconhecimento das letras.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/educational/turmadamonica/turma-da-monica-ABC.mp4',
    thumbnail: 'https://cdn.jb.com.br/wp-content/uploads/2024/04/turma-da-monica.jpg',
    description: 'Um clipe educativo onde Mônica, Cebolinha, Magali e Cascão apresentam as letras do alfabeto com humor, músicas e brincadeiras que tornam o aprendizado leve e encantador.',
    skills: ['language', 'cognitive', 'socioemotional']
  },

  {
    id: 'edu-bita-001',
    title: 'Mundo Bita – Alfabita',
    category: 'educational_clip',
    duration: 235,
    ageRecommendation: 'all',
    educationalValue: 'Apresenta o alfabeto por meio da música, estimulando a memorização das letras e o gosto pela aprendizagem divertida.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/educational/mundobita/mundo-bita-alfabita.mp4',
    thumbnail: 'https://mundo-bita.com.br/wp-content/uploads/2023/06/mundo-bita-alfabita.jpg',
    description: 'O Bita e seus amigos cantam e dançam enquanto apresentam as letras do alfabeto em um clipe colorido e animado, que desperta curiosidade, ritmo e alegria no aprendizado das crianças.',
    skills: ['language', 'cognitive', 'creativity', 'socioemotional']
  },

  {
    id: 'edu-bita-002',
    title: 'Mundo Bita – Matemagicamente (com Casuarina)',
    category: 'educational_clip',
    duration: 190, // estimado: ~4 minutos e 5 segundos
    ageRecommendation: 'all',
    educationalValue: 'Apresenta conceitos básicos de matemática de forma musical e divertida, incentivando o raciocínio lógico, a contagem e a curiosidade sobre os números.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/educational/mundobita/mundo-bita-matemagicamente-casuarina.mp4',
    thumbnail: 'https://mundo-bita.com.br/wp-content/uploads/2023/05/matemagicamente-mundo-bita.jpg',
    description: 'O Bita e o grupo Casuarina cantam juntos sobre o mundo dos números, mostrando que aprender matemática pode ser mágico, musical e cheio de descobertas alegres.',
    skills: ['cognitive', 'language', 'creativity']
  },

  {
    id: 'edu-numeros-001',
    title: 'Aprenda a Contar e Escrever os Números',
    category: 'educational_clip',
    duration: 1135,
    ageRecommendation: 'all',
    educationalValue: 'Ensina a contagem e a escrita dos números de forma lúdica, ajudando as crianças a desenvolverem noções de quantidade, reconhecimento visual e coordenação motora.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/educational/outros/Aprenda-a-Contar-e-Escrever-os-Numeros.mp4',
    thumbnail: 'https://i.ytimg.com/vi/eRP5_oy9cfw/hqdefault.jpg',
    description: 'Um vídeo educativo e divertido que apresenta os números de 1 a 10 com música e animações simples, estimulando a concentração e o aprendizado das primeiras noções matemáticas.',
    skills: ['cognitive', 'language', 'motor_skills']
  },

  {
    id: 'edu-coresformas-001',
    title: 'Aprenda as Cores e as Formas Geométricas',
    category: 'educational_clip',
    duration: 865, // duração real ~6m38s
    ageRecommendation: 'all',
    educationalValue: 'Apresenta as principais cores e formas geométricas por meio de animações simples e canções educativas, estimulando a percepção visual e o aprendizado lúdico.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/educational/outros/AprendaascoreseasformasgeometricasDesenhosEducativos.mp4',
    thumbnail: 'https://i.ytimg.com/vi/NZF-3bksnf8/hqdefault.jpg',
    description: 'Com personagens divertidos e músicas envolventes, este vídeo ajuda as crianças a identificar cores e formas do dia a dia, desenvolvendo atenção, linguagem e reconhecimento visual de maneira alegre e interativa.',
    skills: ['cognitive', 'language', 'creativity']
  },

  {
    id: 'edu-animaisfazenda-001',
    title: 'Os Animais da Fazenda para Crianças – Vocabulário para Crianças',
    category: 'educational_clip',
    duration: 218, // duração real ~6m12s
    ageRecommendation: 'all',
    educationalValue: 'Apresenta os principais animais da fazenda e seus sons, ampliando o vocabulário infantil e estimulando a associação entre imagem, som e palavra.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/educational/outros/Osanimaisdafazendaparacriancas-Vocabularioparacriancas.mp4',
    thumbnail: 'https://i.ytimg.com/vi/e123lOibPN0/hqdefault.jpg',
    description: 'Um vídeo educativo e colorido que ensina sobre vacas, cavalos, galinhas e outros animais da fazenda. As crianças aprendem seus nomes e sons de maneira divertida e interativa.',
    skills: ['language', 'cognitive',]
  },

  {
    id: 'edu-jac-001',
    title: 'Jac Jacaré – Escova, Escova',
    category: 'educational_clip',
    duration: 156, // duração real ~3m01s
    ageRecommendation: 'all',
    educationalValue: 'Ensina de forma divertida a importância da escovação dos dentes e da higiene pessoal, incentivando bons hábitos desde cedo.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/educational/outros/JacJacareEscovaescova.mp4',
    thumbnail: 'https://i.ytimg.com/vi/Zd8Rw004iXI/hqdefault.jpg',
    description: 'Jac Jacaré canta e dança enquanto ensina as crianças a escovar os dentes corretamente. Um clipe musical alegre que transforma o momento da higiene em uma brincadeira divertida.',
    skills: ['socioemotional', 'motor_skills', 'language', 'cognitive']
  },

  {
    id: 'edu-dividir-001',
    title: 'Dividir é Legal – Bé e Nito',
    category: 'educational_clip',
    duration: 121, // duração real ~3m08s
    ageRecommendation: 'all',
    educationalValue: 'Ensina o valor da generosidade e da partilha, incentivando atitudes positivas e o convívio harmonioso entre as crianças.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/educational/outros/dividir-e-legal.mp4',
    thumbnail: 'https://i.ytimg.com/vi/9w45tIuDXBI/hqdefault.jpg',
    description: 'Uma música alegre com Bé e Nito que mostra como compartilhar brinquedos, risadas e carinho torna o dia mais feliz. Estimula empatia, amizade e comportamento cooperativo.',
    skills: ['socioemotional', 'language', 'creativity', 'cognitive']
  },

  {
    id: 'edu-bita-003',
    title: 'Mundo Bita – Fundo do Mar',
    category: 'educational_clip',
    duration: 148, // estimativa ~4 minutos (ajuste se tiver o valor exato)
    ageRecommendation: 'all',
    educationalValue: 'Leva as crianças a uma viagem divertida pelo fundo do mar, apresentando animais marinhos, suas características e sons, estimulando curiosidade, vocabulário e respeito à natureza.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/educational/mundobita/MundoBita-FundodoMar.mp4',
    thumbnail: 'https://i.ytimg.com/vi/iY91JoMWQoM/hqdefault.jpg',
    description: 'Neste clipe musical do Mundo Bita, a turminha embarca num submarino amarelo para conhecer peixes-coloridos, baleias, tubarões e coral-vivos. Um vídeo educativo e animado que permite às crianças explorar o oceano com alegria e aprender sobre biodiversidade marinha.',
    skills: ['language', 'cognitive', 'creativity', 'socioemotional']
  }


];

// Comerciais educativos
const commercials: Video[] = [
  {
    id: 'com-lobato-001',
    title: 'Rock das Frutas – A Turma do Seu Lobato',
    category: 'commercial',
    duration: 166, // duração real ~2m32s
    ageRecommendation: 'all',
    educationalValue: 'Apresenta os benefícios das frutas de forma divertida e musical, incentivando hábitos de alimentação saudável e o interesse por alimentos naturais.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/educational/turmalobato/RockdasFrutas-ATurmadoSeuLobato.mp4',
    thumbnail: 'https://i.ytimg.com/vi/LM_G8Stwm50/hqdefault.jpg',
    description: 'Com ritmo animado e muita energia, a Turma do Seu Lobato canta sobre as frutas e seus benefícios, estimulando as crianças a se alimentarem de forma saudável e alegre.',
    skills: ['cognitive', 'socioemotional', 'language', 'creativity']
  },

  {
    id: 'edu-bebaagua-001',
    title: 'Beba Água – Vamos Nos Manter Hidratados!',
    category: 'commercial',
    duration: 202, // estimativa ~5 minutos e 16 segundos
    ageRecommendation: 'all',
    educationalValue: 'Incentiva a importância de manter-se hidratado de forma divertida e musical, ajudando as crianças a entenderem por que beber água é um hábito essencial para saúde e bem-estar. :contentReference[oaicite:2]{index=2}',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/educational/outros/bebaagua.mp4',
    thumbnail: 'https://i.ytimg.com/vi/sDiPlC-IJfk/hqdefault.jpg',
    description: 'Uma música animada com letra simples para crianças sobre a importância da água — onde beber água vira brincadeira e hábito saudável em família ou na escola.',
    skills: ['socioemotional', 'motor_skills', 'language', 'cognitive']
  },
  {
    id: 'edu-fauna-flora-001',
    title: 'Palavra Cantada – Canção Para Fauna e Flora',
    category: 'commercial',
    duration: 243,   // estimativa de ~3 minutos (versão single) :contentReference[oaicite:2]{index=2}
    ageRecommendation: 'all',
    educationalValue: 'Promove a consciência ambiental ao apresentar biomas brasileiros, fauna e flora, estimulando o respeito à natureza, o reconhecimento da biodiversidade e o cuidado com o meio-ambiente. :contentReference[oaicite:3]{index=3}',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/educational/palavracantada/FaunaeFlora.mp4',
    thumbnail: 'https://i.ytimg.com/vi/1yza3Nr3xF8/hqdefault.jpg',
    description: 'Uma música animada e educativa onde a Palavra Cantada e convidados celebram a fauna e a flora brasileiras — com letra que menciona biomas, rios, animais e vegetação — convidando crianças a aprenderem sobre o meio-ambiente com alegria.',
    skills: ['cognitive', 'language', 'creativity']
  },
  {
    id: 'edu-bita-diferenca-001',
    title: 'Mundo Bita – A Diferença é o Que nos Une',
    category: 'commercial',
    duration: 202,             // estimativa ~3m18s baseado no vídeo oficial. :contentReference[oaicite:0]{index=0}
    ageRecommendation: 'all',
    educationalValue: 'Promove a inclusão e o respeito às diferenças, mostrando que convivência harmoniosa e diversidade são motivos de aprendizado e alegria.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/educational/mundobita/MundoBita-ADiferencaoQuenosUne.mp4',
    thumbnail: 'https://i.ytimg.com/vi/eLtzvypcurE/hqdefault.jpg',
    description: 'Com o carisma de Bita, Lila e amigos, este clipe celebra a diversidade humana e a ideia de que a diferença entre as pessoas é justamente o que nos une de verdade. Ensina solidariedade, respeito e amizade de forma musical e divertida.',
    skills: ['socioemotional', 'language', 'cognitive', 'creativity']
  },
  {
    id: 'edu-bellinha-respeito-001',
    title: 'Bellinha – Respeito é Bom',
    category: 'commercial',
    duration: 202,             // estimativa ~3m06s com base no clipe oficial. :contentReference[oaicite:1]{index=1}
    ageRecommendation: 'all',
    educationalValue: 'Incentiva atitudes de respeito e convivência saudável, ensinando que todos merecem consideração, valorizando empatia, gentileza e comunicação positiva.',
    url: '/api/stream?path=/Videos/tv-do-yuri/public/videos/educational/outros/Bellinha-Respeitobom.mp4',
    thumbnail: 'https://i.ytimg.com/vi/rBfAeuuWmgQ/hqdefault.jpg',
    description: 'No vídeo animado, Bellinha e amigos cantam sobre como é importante tratar bem os outros, dividir espaço, ouvir, colaborar e respeitar as diferenças – com ritmo e simplicidade para crianças pequenas.',
    skills: ['socioemotional', 'language', 'creativity']
  }


];

export const allVideos: Video[] = [
  ...cartoonVideos,
  ...educationalClips,
  ...commercials,
];

export const videoFolders: VideoFolder[] = [
  {
    id: 'cartoon-os-vegetais',
    name: 'Os Vegetais',
    category: 'cartoon',
    videos: cartoonVideos.filter((v) => v.id.startsWith('osvegetais')),
    description: 'Músicas e histórias educativas com a turma dos Vegetais',
    icon: '🥕',
  },


  {
    id: 'cartoon-arthur',
    name: 'Arthur',
    category: 'cartoon',
    videos: cartoonVideos.filter((v) => v.id.startsWith('artur')),
    description: 'Aventuras cotidianas que ensinam sobre amizade, empatia e respeito às diferenças.',
    icon: '🐰',
  },

  {
    id: 'cartoon-bluey',
    name: 'Bluey',
    category: 'cartoon',
    videos: cartoonVideos.filter((v) => v.id.startsWith('bluey')),
    description: 'Uma série encantadora sobre o poder do brincar e das relações familiares, que ensina empatia, criatividade e cooperação.',
    icon: '🐶',
  },

  {
    id: 'cartoon-george',
    name: 'George, o Curioso',
    category: 'cartoon',
    videos: cartoonVideos.filter((v) => v.id.startsWith('george')),
    description: 'Aventuras educativas cheias de curiosidade, descobertas e lições sobre natureza, amizade e trabalho em equipe. Ideal para estimular a imaginação e o aprendizado científico das crianças.',
    icon: '🐵',
  },



  {
    id: 'educational-clips',
    name: 'Clipes Educativos',
    category: 'educational_clip',
    videos: educationalClips,
    description: 'Conteúdo educativo curto e envolvente',
    icon: '📚',
  },
  {
    id: 'commercials',
    name: 'Comerciais Educativos',
    category: 'commercial',
    videos: commercials,
    description: 'Mensagens educativas e divertidas',
    icon: '📢',
  },
];

// Função que ajusta arrays in-place (sem recriar tudo)
function remapArrayUrls(arr: Video[]) {
  for (const v of arr) if (typeof v.url === 'string') v.url = mapVideoUrl(v.url);
}

remapArrayUrls(cartoonVideos);
remapArrayUrls(educationalClips);
remapArrayUrls(commercials);