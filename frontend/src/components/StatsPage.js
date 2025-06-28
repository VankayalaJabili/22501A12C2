import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Divider,
} from '@mui/material';
import { logEvent } from '../utils/logger';

const StatsPage = () => {
  const [stats, setStats] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('shortenedUrls') || '[]');
      setStats(data);
      logEvent('Stats loaded (frontend only)');
    } catch (err) {
      setError('Could not load statistics.');
    }
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Shortened URL Statistics</Typography>
      {error && <Typography color="error">{error}</Typography>}

      {stats.map((item, index) => (
        <Card key={index} sx={{ my: 2 }}>
          <CardContent>
            <Typography variant="h6">{window.location.origin}/{item.shortcode}</Typography>
            <Typography variant="body2" color="text.secondary">
              Original URL: <a href={item.originalUrl}>{item.originalUrl}</a><br />
              Created At: {new Date(item.createdAt).toLocaleString()}<br />
              Expires At: {new Date(item.expiresAt).toLocaleString()}<br />
              Total Clicks: {item.clicks.length}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1">Click Analytics:</Typography>
            {item.clicks.length > 0 ? (
              item.clicks.map((click, i) => (
                <Box key={i} sx={{ ml: 2, my: 1 }}>
                  <Typography variant="body2">
                    • Time: {new Date(click.timestamp).toLocaleString()} <br />
                    &nbsp;&nbsp;Source: {click.referrer || 'Direct'} <br />
                    &nbsp;&nbsp;Location: {click.geo || 'Unknown'}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" sx={{ ml: 2 }}>No clicks recorded yet.</Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default StatsPage;
