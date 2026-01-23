# Redis Caching Test Script

This script demonstrates the performance improvement of Redis caching in the SupplySafe application.

## Prerequisites
- Redis server running on localhost:6379
- Next.js development server running on localhost:3000
- Database with sample data

## Test Commands

### Test Products API Caching

```bash
# First request (Cache Miss)
echo "First request - should fetch from database:"
time curl -X GET "http://localhost:3000/api/products" -H "Content-Type: application/json"

echo "\n\nSecond request - should fetch from cache:"
time curl -X GET "http://localhost:3000/api/products" -H "Content-Type: application/json"

echo "\n\nThird request - should fetch from cache:"
time curl -X GET "http://localhost:3000/api/products" -H "Content-Type: application/json"
```

### Test User API Caching (Replace USER_ID with actual user ID)

```bash
# First request (Cache Miss)
echo "First user request - should fetch from database:"
time curl -X GET "http://localhost:3000/api/users/USER_ID" -H "Content-Type: application/json"

echo "\n\nSecond user request - should fetch from cache:"
time curl -X GET "http://localhost:3000/api/users/USER_ID" -H "Content-Type: application/json"
```

### Test Cache Invalidation

```bash
# Create a new product (should invalidate product cache)
curl -X POST "http://localhost:3000/api/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product for Cache",
    "description": "Testing cache invalidation",
    "category": "vegetables",
    "price": 5.99,
    "unit": "kg",
    "supplierId": "SUPPLIER_ID_HERE"
  }'

# Immediately request products again (should be cache miss)
echo "\nAfter product creation - should be cache miss:"
time curl -X GET "http://localhost:3000/api/products" -H "Content-Type: application/json"
```

## Expected Results

### Without Cache
- Response time: ~100-200ms
- Log: "Cache Miss - Fetching from DB"

### With Cache
- Response time: ~10-20ms  
- Log: "Cache Hit - Products"

### Cache Invalidation
- After POST/PUT/DELETE operations
- Log: "Invalidated X product cache keys"

## Performance Metrics

The caching implementation should show:
- **90%+ reduction** in response time for cached requests
- **Reduced database load** for frequently accessed data
- **Automatic cache refresh** after 60 seconds (TTL)
- **Immediate invalidation** on data changes

## Monitoring Cache Performance

Check the Next.js server logs to see:
- Cache hit/miss messages
- Cache invalidation logs
- Response time improvements
