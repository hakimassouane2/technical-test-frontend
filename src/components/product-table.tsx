import { Button, Grid, Modal, Stack, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import React from "react";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface MyFormValues {
  name: string;
  price: number;
  description: string;
}

export default function ProductTable() {
  const [productTableData, setProductTableData] = React.useState([]);
  const initialValues: MyFormValues = { name: "", price: 0, description: "" };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchProductTableData = async () => {
    const products = await axios.get("http://localhost:8080/products");
    setProductTableData(products.data || []);
  };

  React.useEffect(() => {
    fetchProductTableData();
  }, []);

  return (
    <>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        direction="row"
        alignContent="center"
        justifyItems="center"
        alignItems="center"
        sx={{ m: 2, textAlign: "center" }}
      >
        <Grid item xs={12}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Product Table
          </Typography>
          <Formik
            initialValues={initialValues}
            onSubmit={async (values, actions) => {
              console.log({ values, actions });
              await axios.post("http://localhost:8080/products", values);
              fetchProductTableData();
            }}
          >
            <Form>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                alignContent="center"
                justifyItems="center"
                alignItems="center"
              >
                <label htmlFor="name">Name</label>
                <Field id="name" name="name" placeholder="The book Name" />
                <label htmlFor="price">Price</label>
                <Field id="price" name="price" placeholder="The book Price" />
                <label htmlFor="description">Description</label>
                <Field
                  id="description"
                  name="description"
                  placeholder="The book Description"
                />
                <Button variant="contained" type="submit">
                  Submit
                </Button>
              </Stack>
            </Form>
          </Formik>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        sx={{ m: 2 }}
        direction="row"
        justifyContent="center"
        alignContent="center"
        justifyItems="center"
        alignItems="center"
      >
        <Grid item xs={11}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productTableData.map((product: any) => (
                  <TableRow
                    key={product.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {product.name}
                    </TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClickOpen}
                        sx={{ mr: 2 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={async () => {
                          await axios.delete(
                            `http://localhost:8080/products/${product.id}`
                          );
                          fetchProductTableData();
                        }}
                      >
                        DELETE
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can edit the product with this dialog box
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="price"
            label="Price"
            type="number"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Modify</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
