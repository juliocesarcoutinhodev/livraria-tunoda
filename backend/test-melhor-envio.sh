#!/bin/bash

# Script de teste da integração Melhor Envio
# Execute este script após iniciar a aplicação

echo "============================================"
echo "   TESTE DE INTEGRAÇÃO - MELHOR ENVIO"
echo "============================================"
echo ""

BASE_URL="http://localhost:8080"

echo "1️⃣  Criando carrinho..."
CART_RESPONSE=$(curl -s -X POST "$BASE_URL/api/carts")
CART_ID=$(echo $CART_RESPONSE | grep -o '"cartId":"[^"]*' | cut -d'"' -f4)

if [ -z "$CART_ID" ]; then
    echo "❌ Erro ao criar carrinho"
    echo "Resposta: $CART_RESPONSE"
    exit 1
fi

echo "✅ Carrinho criado: $CART_ID"
echo ""

echo "2️⃣  Listando livros disponíveis..."
BOOKS_RESPONSE=$(curl -s "$BASE_URL/api/public/books?size=1")
BOOK_ID=$(echo $BOOKS_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$BOOK_ID" ]; then
    echo "⚠️  Nenhum livro encontrado. Cadastre um livro primeiro!"
    echo ""
    echo "Execute:"
    echo "curl -X POST $BASE_URL/api/admin/books \\"
    echo "  -H 'Content-Type: application/json' \\"
    echo "  -d '{"
    echo "    \"title\": \"Clean Code\","
    echo "    \"description\": \"A Handbook of Agile Software Craftsmanship\","
    echo "    \"price\": 49.90,"
    echo "    \"weight\": 0.5,"
    echo "    \"photoUrl\": \"https://m.media-amazon.com/images/I/41xShlnTZTL._SY445_SX342_.jpg\","
    echo "    \"authorIds\": [\"<author-id-aqui>\"]"
    echo "  }'"
    exit 1
fi

echo "✅ Livro encontrado: $BOOK_ID"
echo ""

echo "3️⃣  Adicionando livro ao carrinho..."
ADD_ITEM_RESPONSE=$(curl -s -X POST "$BASE_URL/api/carts/$CART_ID/items" \
  -H "Content-Type: application/json" \
  -d "{\"bookId\": \"$BOOK_ID\", \"quantity\": 1}")

if echo "$ADD_ITEM_RESPONSE" | grep -q "error"; then
    echo "❌ Erro ao adicionar item"
    echo "Resposta: $ADD_ITEM_RESPONSE"
    exit 1
fi

echo "✅ Livro adicionado ao carrinho"
echo ""

echo "4️⃣  Criando cotação de frete..."
QUOTE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/shipping/quotes?cartId=$CART_ID")
QUOTE_ID=$(echo $QUOTE_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$QUOTE_ID" ]; then
    echo "❌ Erro ao criar cotação"
    echo "Resposta: $QUOTE_RESPONSE"
    exit 1
fi

echo "✅ Cotação criada: $QUOTE_ID"
echo ""

echo "5️⃣  Calculando frete com Melhor Envio..."
CALCULATE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/shipping/quotes/$QUOTE_ID/calculate")

if echo "$CALCULATE_RESPONSE" | grep -q "error"; then
    echo "❌ Erro ao calcular frete"
    echo "Resposta: $CALCULATE_RESPONSE"
    echo ""
    echo "Verifique:"
    echo "  - Token do Melhor Envio está configurado no .env"
    echo "  - Aplicação foi reiniciada após configurar o token"
    echo "  - Token não expirou"
    exit 1
fi

if echo "$CALCULATE_RESPONSE" | grep -q "CALCULATED"; then
    echo "✅ Frete calculado com sucesso!"
    echo ""
    echo "📦 OPÇÕES DE FRETE:"
    echo "===================="
    echo "$CALCULATE_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$CALCULATE_RESPONSE"
else
    echo "⚠️  Resposta inesperada:"
    echo "$CALCULATE_RESPONSE"
fi

echo ""
echo "============================================"
echo "   TESTE CONCLUÍDO"
echo "============================================"

