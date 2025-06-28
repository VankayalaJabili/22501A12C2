import React, { useState } from 'react';
import {
  Box, Button, Card, CardContent, Grid, TextField, Typography,
} from '@mui/material';
import { logEvent } from '../utils/logger';

const UrlShortener = () => {
  const [urls, setUrls] = useState([{ longUrl: '', validity: '', shortcode: '' }]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const addUrlInput = () => {
    if (urls.length < 5) {
      setUrls([...urls, { longUrl: '', validity: '', shortcode: '' }]);
    } else {
      setError('You can only shorten up to 5 URLs at a time.');
    }
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const shortenUrls = () => {
    setError('');
    const validInputs = urls.every(u => validateUrl(u.longUrl));
    if (!validInputs) {
      setError('One or more URLs are invalid.');
      logEvent('Invalid URL entered');
      return;
    }

    const existing = JSON.parse(localStorage.getItem('shortenedUrls') || '[]');
    const newResults = [];

    urls.forEach((u) => {
      let shortcode = u.shortcode?.trim() || Math.random().toString(36).substr(2, 6);
      while (existing.some(item => item.shortcode === shortcode)) {
        shortcode = Math.random().toString(36).substr(2, 6);
      }

      const createdAt = new Date().toISOString();
      const validity = u.validity ? parseInt(u.validity) : 30;
      const expiresAt = new Date(Date.now() + validity * 60000).toISOString();

      const entry = {
        shortcode,
        originalUrl: u.longUrl,
        createdAt,
        expiresAt,
        validity,
        clicks: [],
      };

      existing.push(entry);
      newResults.push(entry);
    });

    localStorage.setItem('shortenedUrls', JSON.stringify(existing));
    setResults(newResults);
    logEvent('URLs shortened (frontend only)');
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>React URL Shortener</Typography>

      {urls.map((url, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Original Long URL"
                  value={url.longUrl}
                  onChange={(e) => handleChange(index, 'longUrl', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Validity (min, optional)"
                  type="number"
                  value={url.validity}
                  onChange={(e) => handleChange(index, 'validity', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Preferred Shortcode (optional)"
                  value={url.shortcode}
                  onChange={(e) => handleChange(index, 'shortcode', e.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      <Box mb={2}>
        <Button variant="outlined" onClick={addUrlInput} disabled={urls.length >= 5}>
          Add Another URL
        </Button>
      </Box>

      <Box mb={2}>
        <Button variant="contained" color="primary" onClick={shortenUrls}>
          Shorten URLs
        </Button>
      </Box>

      {error && <Typography color="error">{error}</Typography>}

      {results.length > 0 && (
        <Box>
          <Typography variant="h6">Shortened URLs</Typography>
          {results.map((res, i) => (
            <Box key={i} mt={1}>
              <a href={`/${res.shortcode}`} target="_blank" rel="noopener noreferrer">
                {window.location.origin}/{res.shortcode}
              </a> (expires in {res.validity} mins)
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default UrlShortener;
