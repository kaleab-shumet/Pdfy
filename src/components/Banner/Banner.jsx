import { Card, CardContent, Typography } from '@mui/material';
import './Banner.css'
import Container from '@mui/material/Container';
const Banner = () => {

  return (
    <Container sx={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            PDFY
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Do you have some images and you want to convert them to a PDF? 
            Then you are in the right place. Easily combine different JPG, PNG images into a single PDF and share with others. 
            Completely free, no registration or no watermarks.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Banner;
