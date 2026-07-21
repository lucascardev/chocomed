import connectDB from './db';
import Product from '@/models/Product';
import BlogPost from '@/models/BlogPost';
import Recipe from '@/models/Recipe';
import User from '@/models/User';

export const productsData = [
  {
    name: 'ChocoMED Cacau Puro 70%',
    slug: 'chocomed-cacau-puro-70',
    description: 'Chocolate amargo funcional com 70% de cacau nativo da Bahia, sem adição de açúcares, adoçado naturalmente com eritritol e taumatina. Rico em flavonoides e com impacto glicêmico extremamente baixo, perfeito para diabéticos e entusiastas da alimentação saudável.',
    price: 18.90,
    ingredients: 'Massa de cacau, eritritol, manteiga de cacau, taumatina, emulsificante lecitina de girassol e extrato natural de baunilha.',
    nutritionalInfo: {
      calories: 120,
      carbs: 4,
      glycemicIndex: 15,
      glycemicLoad: 0.6,
    },
    image: '/images/pure-70.jpg',
    stock: 150,
    category: 'Barras',
    rating: 4.8,
  },
  {
    name: 'ChocoMED Cacau & Castanhas',
    slug: 'chocomed-cacau-castanhas',
    description: 'Deliciosa barra de chocolate funcional com pedaços selecionados de castanha-de-caju e castanha-do-pará. Combina gorduras boas e proteínas para retardar ainda mais a absorção de carboidratos, proporcionando energia estável.',
    price: 21.90,
    ingredients: 'Massa de cacau, eritritol, castanha-de-caju picada, castanha-do-pará picada, manteiga de cacau, emulsificante lecitina de girassol.',
    nutritionalInfo: {
      calories: 135,
      carbs: 4.5,
      glycemicIndex: 18,
      glycemicLoad: 0.8,
    },
    image: '/images/nuts.jpg',
    stock: 120,
    category: 'Barras',
    rating: 4.9,
  },
  {
    name: 'ChocoMED Ao Leite de Coco',
    slug: 'chocomed-ao-leite-de-coco',
    description: 'A suavidade do chocolate ao leite em uma versão 100% vegana e saudável, feita com leite de coco em pó e cacau selecionado. Textura incrivelmente cremosa que derrete na boca sem elevar a glicemia.',
    price: 19.90,
    ingredients: 'Manteiga de cacau, eritritol, leite de coco em pó, cacau em pó, taumatina, lecitina de girassol.',
    nutritionalInfo: {
      calories: 125,
      carbs: 5.5,
      glycemicIndex: 20,
      glycemicLoad: 1.1,
    },
    image: '/images/coconut.jpg',
    stock: 100,
    category: 'Barras',
    rating: 4.7,
  },
  {
    name: 'Bombons Sortidos ChocoMED',
    slug: 'bombons-sortidos-chocomed',
    description: 'Caixa com 12 bombons funcionais recheados nos sabores maracujá trufado, pasta de amendoim integral e creme de cacau com avelã. Perfeito para presentear e saborear momentos de afeto com total segurança glicêmica.',
    price: 45.00,
    ingredients: 'Massa de cacau, eritritol, polpa de maracujá desidratada, pasta de amendoim integral, pasta de avelã natural, manteiga de cacau, lecitina de girassol.',
    nutritionalInfo: {
      calories: 75, // por unidade (15g)
      carbs: 3,
      glycemicIndex: 22,
      glycemicLoad: 0.6,
    },
    image: '/images/box.jpg',
    stock: 80,
    category: 'Caixas',
    rating: 4.9,
  },
];

export const blogPostsData = [
  {
    title: 'Entendendo o Índice Glicêmico e Carga Glicêmica',
    slug: 'entendendo-indice-glicemico-e-carga-glicemica',
    summary: 'Muitas pessoas confundem índice glicêmico com carga glicêmica. Entenda a diferença crucial entre eles e como isso impacta a alimentação de quem tem diabetes tipo 2.',
    content: `## A Diferença entre Índice Glicêmico (IG) e Carga Glicêmica (CG)

Para quem tem diabetes tipo 2 ou busca uma alimentação mais equilibrada, compreender o comportamento dos carboidratos no organismo é essencial. Duas métricas ajudam nesse controle: o **Índice Glicêmico (IG)** e a **Carga Glicêmica (CG)**.

### O que é o Índice Glicêmico?
O IG é uma escala que mede a velocidade com que o carboidrato de um alimento se transforma em glicose no sangue.
- **Baixo IG**: menor ou igual a 55 (ex: cacau puro, lentilhas, maçã)
- **Médio IG**: entre 56 e 69 (ex: arroz integral, aveia)
- **Alto IG**: maior ou igual a 70 (ex: açúcar refinado, pão branco)

### O que é a Carga Glicêmica?
A CG é mais precisa, pois calcula o impacto glicêmico com base na **quantidade real** de carboidrato presente na porção que você consome.
A fórmula é:
$$\\text{CG} = \\frac{\\text{IG} \\times \\text{Quantidade de Carboidratos (g)}}{100}$$

- **Baixa CG**: menor ou igual a 10
- **Média CG**: de 11 a 19
- **Alta CG**: maior ou igual a 20

### Por que o ChocoMED é Diferente?
Um chocolate comum de supermercado possui alto IG e alta CG devido ao excesso de açúcar de cana. 
O **ChocoMED Cacau Puro 70%**, por exemplo, possui um IG de **15** e apenas **4g de carboidratos líquidos** por porção de 25g. Isso resulta em uma Carga Glicêmica de apenas **0.6**! É um impacto praticamente nulo na glicemia, tornando o consumo seguro e prazeroso.
`,
    image: '/images/blog-glycemic.jpg',
  },
  {
    title: 'Cacau e Diabetes Tipo 2: Um Aliado Científico no Controle Glicêmico',
    slug: 'cacau-e-diabetes-tipo-2-aliado-cientifico',
    summary: 'Estudos demonstram que os flavonoides do cacau podem melhorar a sensibilidade à insulina e ajudar na prevenção de complicações do diabetes.',
    content: `## A Ciência por trás do Cacau e da Insulina

Durante muito tempo, pessoas com diabetes foram orientadas a evitar totalmente o chocolate. No entanto, pesquisas científicas recentes indicam que o **cacau puro** não apenas é seguro, mas pode agir como um coadjuvante no controle metabólico.

### O Poder dos Flavonoides
O cacau é uma das fontes mais ricas da natureza em flavonoides, compostos antioxidantes com propriedades anti-inflamatórias.
Estudos clínicos apontam que os flavonoides do cacau atuam de duas maneiras principais:
1. **Melhora da Sensibilidade à Insulina**: Ajudam a otimizar a captação de glicose pelas células musculares e tecidos periféricos, diminuindo a resistência insulínica.
2. **Proteção Cardiovascular**: Diabéticos têm maior risco de desenvolver problemas cardíacos. Os flavonoides auxiliam na produção de óxido nítrico, promovendo a dilatação dos vasos sanguíneos e reduzindo a pressão arterial.

### Nem Todo Chocolate é Cacau
Para usufruir destes benefícios, o chocolate precisa ter alta concentração de sólidos de cacau (acima de 70%) e ser livre de açúcares refinados ou gorduras hidrogenadas. 
A linha da **ChocoMED** foi projetada a partir de pesquisas científicas para preservar ao máximo os flavonoides ativos do cacau baiano, garantindo sabor, saúde e proteção vascular no mesmo tablete.
`,
    image: '/images/blog-cocoa.jpg',
  },
  {
    title: 'Dicas de Alimentação Saudável para Diabéticos no Dia a Dia',
    slug: 'dicas-alimentacao-saudavel-diabeticos',
    summary: 'Pequenos hábitos e escolhas inteligentes de combinação de alimentos podem revolucionar o controle das suas taxas glicêmicas.',
    content: `## Como Manter a Glicemia Sob Controle sem Perder o Prazer de Comer

Controlar o diabetes tipo 2 não significa adotar uma dieta sem graça e cheia de restrições extremas. O segredo está em fazer combinações inteligentes e escolher alimentos ricos em nutrientes e fibras.

### 1. Pratique a Regra da Combinação (Proteínas + Fibras)
Evite comer carboidratos isolados. Ao consumir uma fruta, combine-a com castanhas ou chia. As gorduras boas e as fibras reduzem a velocidade da digestão, evitando picos glicêmicos rápidos.

### 2. Substitua o Açúcar por Adoçantes Naturais Seguros
Substâncias artificiais podem prejudicar a microbiota intestinal. Prefira adoçantes naturais de baixo impacto como o **Eritritol** (que possui índice glicêmico zero) e a **Taumatina** (proteína doce natural). Eles são os responsáveis pela doçura dos chocolates ChocoMED.

### 3. Mantenha um Diário de Alimentação Consciente
Observar como seu corpo reage a diferentes alimentos ajuda a mapear quais porções são ideais para o seu organismo. Use ferramentas como a **Calculadora de Consumo Consciente da ChocoMED** para estimar o impacto glicêmico das suas sobremesas antes de consumi-las.
`,
    image: '/images/blog-habits.jpg',
  },
];

export const recipesData = [
  {
    title: 'Mousse de Cacau Funcional com ChocoMED 70%',
    slug: 'mousse-de-cacau-funcional-chocomed',
    description: 'Uma sobremesa aerada, cremosa e extremamente rica em antioxidantes. Não leva açúcar e tem textura perfeita.',
    ingredients: [
      '100g de chocolate ChocoMED Cacau Puro 70% picado',
      '1 caixinha de creme de leite leve ou creme de coco (200g)',
      '3 claras de ovo pasteurizadas',
      '2 colheres de sopa de eritritol',
      '1 colher de chá de essência de baunilha'
    ],
    instructions: [
      'Derreta o chocolate ChocoMED Cacau Puro 70% em banho-maria ou no micro-ondas de 30 em 30 segundos, mexendo sempre.',
      'Misture o creme de leite/coco e a baunilha ao chocolate derretido até obter um creme brilhante e homogêneo.',
      'Bata as claras em neve na batedeira. Quando começarem a firmar, adicione o eritritol aos poucos e continue batendo até obter picos firmes.',
      'Incorpore delicadamente as claras em neve ao creme de chocolate, fazendo movimentos suaves de baixo para cima para manter o ar na mousse.',
      'Distribua em taças individuais e leve à geladeira por no mínimo 3 horas antes de servir. Decore com raspas de ChocoMED.'
    ],
    nutritionalInfo: {
      calories: 145,
      carbs: 5,
      glycemicIndex: 16
    },
    image: '/images/recipe-mousse.jpg',
  },
  {
    title: 'Cookies Integrais de Castanha com Gotas de ChocoMED',
    slug: 'cookies-integrais-de-castanha-chocomed',
    description: 'Cookies crocantes por fora e macios por dentro, ricos em fibras e gorduras saudáveis das castanhas.',
    ingredients: [
      '1 xícara de farinha de amêndoas ou aveia sem glúten',
      '3 colheres de sopa de eritritol',
      '1 ovo inteiro',
      '2 colheres de sopa de óleo de coco derretido',
      '1/2 xícara de castanhas picadas',
      '50g de chocolate ChocoMED Cacau & Castanhas picado em gotas',
      '1 colher de chá de fermento em pó'
    ],
    instructions: [
      'Pré-aqueça o forno a 180°C e forre uma assadeira com papel manteiga.',
      'Em uma tigela, misture a farinha de amêndoas/aveia, o eritritol e o fermento em pó.',
      'Adicione o ovo e o óleo de coco derretido à mistura seca e misture bem até formar uma massa modelável.',
      'Incorpore delicadamente as castanhas picadas e as gotas de chocolate ChocoMED.',
      'Modele pequenas bolinhas, achate-as levemente no formato de cookies e coloque-as na assadeira com espaço entre elas.',
      'Asse por 12 a 15 minutos ou até que as bordas comecem a dourar. Deixe esfriar completamente na grade para ficarem crocantes.'
    ],
    nutritionalInfo: {
      calories: 98, // por cookie
      carbs: 3.8,
      glycemicIndex: 18
    },
    image: '/images/recipe-cookies.jpg',
  },
];

export async function seedDatabase() {
  await connectDB();

  // Clear existing data to avoid duplication during seed
  await Product.deleteMany({});
  await BlogPost.deleteMany({});
  await Recipe.deleteMany({});

  // Seed Products
  await Product.insertMany(productsData);
  
  // Seed Blog Posts
  await BlogPost.insertMany(blogPostsData);

  // Seed Recipes
  await Recipe.insertMany(recipesData);

  // Setup default Admin if needed
  const adminExists = await User.findOne({ isAdmin: true });
  if (!adminExists) {
    // We can create a default admin record for demonstration
    await User.findOneAndUpdate(
      { clerkId: 'user_default_admin_id' },
      {
        email: 'admin@chocomed.com.br',
        name: 'Administrador ChocoMED',
        isAdmin: true,
        points: 9999,
      },
      { upsert: true }
    );
  }

  console.log('Database seeded successfully!');
}
