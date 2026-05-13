# Rastreamento de conversão

É possível usar o Pixel da Meta para rastrear as ações dos visitantes do seu site.

As conversões rastreadas aparecem no **Gerenciador de Anúncios do Facebook** e no **Gerenciador de Eventos do Facebook** e podem ser usadas para:

- Analisar a eficiência do funil de conversão;
- Calcular o retorno sobre o investimento em anúncios;
- Definir Públicos Personalizados para otimização de anúncios;
- Otimizar campanhas de anúncios de catálogo Advantage+.

Depois de definir os Públicos Personalizados, podemos usá-los para identificar outros usuários do Facebook propensos à conversão e direcioná-los com seus anúncios.

Há três maneiras de rastrear conversões com o Pixel:

- **Eventos padrão:** ações de visitantes predefinidas que você relata ao chamar uma função de Pixel;
- **Eventos personalizados:** ações de visitantes que você definiu e relata ao chamar uma função de Pixel;
- **Conversões personalizadas:** ações de visitantes que são rastreadas automaticamente por meio da análise dos URLs de referência do seu site.

---

# Restrições para conversões personalizadas

A partir de **2 de setembro de 2025**, serão aplicadas restrições adicionais e proativas a conversões personalizadas que possam sugerir informações não permitidas nos termos da Meta.

Por exemplo, qualquer conversão personalizada que sugira condições de saúde específicas, como:

- `artrite`
- `diabetes`

Ou situação financeira, como:

- `pontuação de crédito`
- `alta renda`

Será sinalizada e impedida de ser usada para veicular campanhas publicitárias.

## Como essas restrições afetam suas campanhas

- Não será possível usar conversões personalizadas que foram sinalizadas ao criar novas campanhas.
- Se houver uma campanha ativa com conversões personalizadas que foram sinalizadas, crie uma nova campanha ou duplique a existente usando uma conversão personalizada não afetada pelas restrições para evitar problemas de desempenho e otimização.

## Para desenvolvedores da API

A partir de **2 de setembro de 2025**, o campo `is_unavailable` retornará `true` para indicar que uma conversão personalizada foi sinalizada.

Saiba mais sobre essa atualização e veja como resolver conversões personalizadas que foram sinalizadas.

---

# Requisitos

O código de base do Pixel já deve estar instalado nas páginas em que você quer rastrear as conversões.

---

# Eventos padrão

Os eventos padrão são ações predefinidas de visitantes que correspondem a atividades comuns relacionadas a conversões, como:

- Pesquisar;
- Visualizar um produto;
- Comprar um produto.

Os eventos padrão aceitam parâmetros, permitindo que você inclua um objeto com informações adicionais sobre um evento, como:

- Identificações de produtos;
- Categorias;
- Número de itens comprados.

Para ver uma lista completa de eventos padrão, acesse a referência de eventos padrão do Pixel.

Saiba mais sobre o rastreamento de conversão e os eventos padrão no Blueprint.

---

# Como rastrear eventos padrão

Todos os eventos padrão são rastreados por meio da chamada à função `fbq('track')` do Pixel, com o nome do evento e, opcionalmente, um objeto JSON como parâmetros.

Por exemplo, esta é a chamada a uma função para rastrear quando um visitante concluir um evento de compra com a moeda e o valor incluídos como parâmetro:

```javascript
fbq('track', 'Purchase', {currency: "USD", value: 30.00});
```

Se você chamar essa função, ela será rastreada como um evento de compra no Gerenciador de Eventos.

Você pode chamar a função `fbq('track')` em qualquer lugar entre as tags `<body>` de abertura e fechamento da sua página da web, quando a página é carregada ou quando um visitante conclui uma ação, como clicar em um botão.

Por exemplo, se você quiser rastrear um evento de compra padrão depois que um visitante conclui a compra, poderá chamar a função `fbq('track')` na página de confirmação de compra desta maneira:

```html
<body>
  ...
  <script>
    fbq('track', 'Purchase', {currency: "USD", value: 30.00});
  </script>
  ...
</body>
```

No entanto, se você quiser rastrear um evento de compra padrão quando o visitante clica em um botão de compra, poderá associar a chamada à função `fbq('track')` com o botão de compra na sua página de finalização da compra desta maneira:

```html
<button id="addToCartButton">Purchase</button>

<script type="text/javascript">
  $('#addToCartButton').click(function() {
    fbq('track', 'Purchase', {currency: "USD", value: 30.00});
  });
</script>
```

O exemplo anterior usa jQuery para acionar a chamada à função, mas você pode acionar a chamada usando qualquer método que quiser.

---

# Eventos personalizados

Se os eventos padrão predefinidos não atenderem às suas necessidades, você pode rastrear seus próprios eventos personalizados.

Esses eventos também podem ser usados para definir públicos personalizados para otimização de anúncios.

Além disso, os eventos personalizados aceitam parâmetros, que podem ser incluídos para fornecer informações adicionais sobre cada evento personalizado.

Saiba mais sobre o rastreamento de conversão e os eventos personalizados no Blueprint.

---

# Como rastrear eventos personalizados

Você pode rastrear eventos personalizados chamando a função `fbq('trackCustom')` do Pixel, com o nome do evento personalizado e, opcionalmente, um objeto JSON como parâmetro.

Assim como os eventos padrão, é possível chamar a função `fbq('trackCustom')` em qualquer lugar entre as tags `<body>` de abertura e fechamento da sua página da web:

- Quando a página é carregada;
- Quando um visitante conclui uma ação, como clicar em um botão.

Por exemplo, vamos supor que você queira rastrear os visitantes que compartilham uma promoção para ganhar desconto.

Você pode rastreá-los usando um evento personalizado desta maneira:

```javascript
fbq('trackCustom', 'ShareDiscount', {promotion: 'share_discount_10%'});
```

Os nomes de eventos personalizados devem ser strings e não podem exceder **50 caracteres**.

---

# Conversões personalizadas

Sempre que o Pixel é carregado, ele chama automaticamente:

```javascript
fbq('track', 'PageView')
```

Essa chamada rastreia um evento padrão `PageView`.

Os eventos padrão `PageView` registram o URL do referenciador da página que acionou a chamada à função.

Você pode usar esses URLs registrados no Gerenciador de Eventos para definir as ações dos visitantes que devem ser rastreadas.

## Exemplo

Vamos supor que você direcione visitantes que se cadastram na sua lista de correspondência para uma página de agradecimento.

Você pode configurar uma conversão personalizada para rastrear os visitantes do site que visualizaram qualquer página com:

```text
/thank-you
```

no URL.

Caso a sua página de agradecimento seja a única com `/thank-you` no URL, e o Pixel já esteja instalado nessa página, qualquer pessoa que visualizá-la será rastreada usando a conversão personalizada.

Quando forem rastreadas, as conversões personalizadas poderão ser usadas para:

- Otimizar suas campanhas de anúncios;
- Definir públicos personalizados;
- Refinar ainda mais os públicos que dependem de eventos padrão ou personalizados.

Saiba mais sobre as conversões personalizadas no Blueprint.

Como as conversões personalizadas dependem de URLs completos ou parciais, você deve garantir que as ações dos visitantes possam ser definidas exclusivamente com base em strings únicas nos URLs do seu site.

---

# Como criar conversões personalizadas

As conversões personalizadas são criadas totalmente dentro do Gerenciador de Eventos.

Consulte o documento da Central de Ajuda para o Anunciante para saber mais.

---

# Conversões personalizadas com base em regras

Otimize para ações e rastreie as conversões sem adicionar nada ao código de base do Pixel da Meta.

Você pode fazer isso além dos 17 eventos padrão.

## Etapas

1. Crie uma conversão personalizada em:

```text
/{AD_ACCOUNT_ID}/customconversions
```

2. Especifique um URL, ou um URL parcial, que represente um evento em `pixel_rule`.

Por exemplo:

```text
thankyou.html
```

Essa pode ser uma página exibida após a compra.

É registrada uma conversão de `PURCHASE` quando `thankyou.html` é exibido.

Depois disso, você pode criar a campanha usando o objetivo:

```text
CONVERSIONS
```

No nível do conjunto de anúncios, especifique a mesma conversão personalizada no `promoted_object`, incluindo:

- `pixel_id`
- `pixel_rule`
- `custom_event_type`

---

# Insights sobre conversões personalizadas

Os Insights sobre Anúncios retornam informações sobre conversões personalizadas.

```bash
curl -i -G \
-d 'fields=actions,action_values' \
-d 'access_token=<ACCESS_TOKEN>' \
https://graph.facebook.com/v2.7/<AD_ID>/insights
```

Retorna conversões personalizadas e padrão:

```json
{
  "data": [
    {
      "actions": [
        {
          "action_type": "offsite_conversion.custom.17067367629523",
          "value": 1225
        },
        {
          "action_type": "offsite_conversion.fb_pixel_purchase",
          "value": 205
        }
      ],
      "action_values": [
        {
          "action_type": "offsite_conversion.custom.1706736762929507",
          "value": 29390.89
        },
        {
          "action_type": "offsite_conversion.fb_pixel_purchase",
          "value": 29390.89
        }
      ],
      "date_start": "2016-07-28",
      "date_stop": "2016-08-26"
    }
  ],
  "paging": {
    "cursors": {
      "before": "MAZDZD",
      "after": "MjQZD"
    },
    "next": "https://graph.facebook.com/v2.7/<AD_ID>/insights?access_token=<ACCESS_TOKEN>&amp;pretty=0&amp;fields=actions%2Caction_values&amp;date_preset=last_30_days&amp;level=adset&amp;limit=25&amp;after=MjQZD"
  }
}
```

As conversões personalizadas têm IDs únicos.

Faça uma consulta por uma conversão específica, por exemplo, baseada em regras:

```bash
curl -i -G \
-d 'fields=name,pixel,pixel_aggregation_rule' \
-d 'access_token=ACCESS-TOKEN' \
https://graph.facebook.com/v2.7/<CUSTOM_CONVERSION_ID>
```

---

# Limitações da conversão personalizada

O número máximo de conversões personalizadas por conta de anúncios é **100**.

Se você usar a API de Insights sobre Anúncios para consultar as métricas das conversões personalizadas:

- Não há compatibilidade com o detalhamento de IDs de produto;
- Não há compatibilidade com contagens de ações únicas.

---

# Conversões personalizadas que foram sinalizadas

Se uma conversão personalizada for sinalizada, o campo `is_unavailable` será definido como `true`.

```json
{
  "is_unavailable": true,
  "id": "30141209892193360"
}
```

---

# Como resolver conversões personalizadas que foram sinalizadas

Se alguma das suas conversões personalizadas for sinalizada por sugerir informações que não são permitidas pelos termos da Meta, considere as seguintes opções.

## Para resolver uma conversão personalizada sinalizada durante a criação de uma nova campanha

### 1. Crie uma nova conversão personalizada

Use uma nova conversão personalizada e verifique se ela não inclui informações vedadas pelos termos da Meta.

### 2. Escolha uma conversão personalizada diferente

Selecione outra conversão personalizada existente e verifique se ela não contém informações vedadas pelos termos da Meta.

---

## Para resolver uma conversão personalizada sinalizada em uma campanha existente

### Duplique sua campanha e selecione uma conversão personalizada existente

Se você tiver uma campanha em veiculação que foi sinalizada devido a um problema na conversão personalizada, considere duplicar a campanha e selecionar uma conversão personalizada diferente que não esteja sinalizada antes de publicar a nova campanha duplicada.

> **Importante:** depois que a campanha for publicada, não será mais possível remover a conversão personalizada nem selecionar uma opção diferente.

---

# Pedir uma análise

Caso você acredite que sua conversão personalizada tenha sido sinalizada por engano e não inclua informações não permitidas, peça uma análise via:

- Gerenciador de Anúncios, usando a tabela de campanhas;
- Gerenciador de Eventos, acessando a página de conversões personalizadas.

---

# Rastrear conversões fora do site

Rastreie conversões fora do site com seus Pixels.

Para fazer isso, inclua o campo `fb_pixel` no parâmetro `tracking_spec` do anúncio.

Saiba mais.

---

# Parâmetros

Os parâmetros são opcionais.

Eles são objetos formatados em JSON que podem ser incluídos durante o rastreamento de eventos personalizados e padrão.

Eles permitem que você forneça informações adicionais sobre as ações dos visitantes do seu site.

Quando rastreados, os parâmetros podem ser usados para refinar os públicos personalizados que você criar.

Saiba mais sobre parâmetros no Blueprint.

Para incluir um objeto de parâmetro com um evento padrão ou personalizado, formate os dados do parâmetro como um objeto JSON.

Depois, inclua-o como o terceiro parâmetro ao chamar as funções:

```javascript
fbq('track')
```

ou:

```javascript
fbq('trackCustom')
```

## Exemplo

Vamos supor que você queira rastrear um visitante que comprou vários produtos devido à sua promoção.

Você pode fazer isto:

```javascript
fbq('track', 'Purchase',
  // begin parameter object data
  {
    value: 115.00,
    currency: 'USD',
    contents: [
      {
        id: '301',
        quantity: 1
      },
      {
        id: '401',
        quantity: 2
      }
    ],
    content_type: 'product'
  }
  // end parameter object data
);
```

Se você quiser usar os dados incluídos nos parâmetros de eventos ao definir públicos personalizados, os valores de chave não deverão conter espaços.

---

# Propriedades de objetos

Você pode incluir as seguintes propriedades de objetos predefinidas com eventos personalizados e todos os eventos padrão compatíveis.

Formate os dados de objeto de parâmetro usando JSON.

| Chave da propriedade | Tipo de valor | Descrição do parâmetro |
|---|---|---|
| `content_category` | string | Categoria da página ou do produto. |
| `content_ids` | matriz de inteiros ou strings | Identificações de produtos associados ao evento, como SKUs. Exemplo: `['ABC123', 'XYZ789']`. |
| `content_name` | string | Nome da página ou do produto. |
| `content_type` | string | Pode ser `product` ou `product_group` com base em `content_ids` ou `contents` enviados. Se as identificações enviadas forem de produtos, o valor deverá ser `product`. No caso do envio de identificações de grupos de produtos, o valor deverá ser `product_group`. |
| `contents` | matriz de objetos | Uma matriz de objetos JSON que contém o EAN, quando aplicável, ou outro produto ou identificadores de conteúdo associados ao evento, bem como quantidades e preços dos produtos. Obrigatório: `id` e `quantity`. Exemplo: `[{'id': 'ABC123', 'quantity': 2}, {'id': 'XYZ789', 'quantity': 2}]`. |
| `currency` | string | Moeda para o `value` especificado. |
| `delivery_category` | string | Categoria da entrega. Valores compatíveis: `in_store`, `curbside` e `home_delivery`. |
| `num_items` | número inteiro | O número de itens quando a finalização da compra foi iniciada. Usado com o evento `InitiateCheckout`. |
| `predicted_ltv` | número inteiro ou float | O valor vitalício previsto de um usuário cadastrado conforme definido pelo anunciante e expresso como um valor exato. |
| `search_string` | string | A string inserida pelo usuário para a pesquisa. Usado com o evento `Search`. |
| `status` | booleano | Usado com o evento `CompleteRegistration` para mostrar o status do registro. |
| `value` | número inteiro ou float | Obrigatório para eventos de compra ou quaisquer eventos que utilizem otimização de valor. Um valor numérico associado ao evento. Precisa representar um valor monetário. |

## Valores compatíveis para `delivery_category`

| Valor | Descrição |
|---|---|
| `in_store` | A compra exige que o cliente entre na loja. |
| `curbside` | A compra exige a retirada externa. |
| `home_delivery` | A compra é entregue ao cliente. |

---

# Propriedades personalizadas

Se as propriedades predefinidas de objetos não atenderem às suas necessidades, você poderá incluir suas próprias propriedades personalizadas.

As propriedades personalizadas podem ser usadas com eventos personalizados e padrão e podem ajudar você a definir ainda mais os públicos personalizados.

## Exemplo

Vamos supor que você queira rastrear um visitante que comprou vários produtos depois de ter feito primeiro uma comparação com outros produtos.

Você pode fazer isto:

```javascript
fbq('track', 'Purchase',
  // begin parameter object data
  {
    value: 115.00,
    currency: 'USD',
    contents: [
      {
        id: '301',
        quantity: 1
      },
      {
        id: '401',
        quantity: 2
      }
    ],
    content_type: 'product',
    compared_product: 'recommended-banner-shoes', // custom property
    delivery_category: 'in_store'
  }
  // end parameter object data
);
```