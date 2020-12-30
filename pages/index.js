import React, { useState } from "react";
import Link from "next/link";
import Head from "../components/head";
import Container from "@material-ui/core/Container";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

const Home = () => {
  const candidates = ["年収", "自由", "成功"];
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  return (
    <div>
      <Head title="Home" />
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleClose}
          severity="error"
        >
          自慢を検知しました
        </MuiAlert>
      </Snackbar>
      <Container>
        <h1>自慢ディテクター</h1>
        <Box fontSize={25}>
          <p>会話の内容会話の内容</p>
        </Box>
        <Autocomplete
          multiple
          id="tags-filled"
          options={candidates}
          defaultValue={["テスト"]}
          freeSolo
          renderTags={(value, getTagProps) => {
            console.log(value);
            return value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
              />
            ));
          }}
          renderInput={params => (
            <TextField
              {...params}
              variant="outlined"
              label="反応する単語"
              placeholder="単語を追加 +"
            />
          )}
        />
        <Box m={2}>
          <Grid container alignItems="center" justify="center">
            <Grid item>
              <Button variant="outlined" color="secondary" size="large">
                検知開始
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default Home;
