import React, { useState, useEffect, useRef } from "react";
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
  const recognizerRef = useRef();
  const [finalText, setFinalText] = useState("");
  const [transcript, setTranscript] = useState("");
  const candidates = ["年収", "自由", "成功"];
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      console.log("未対応ブラウザ");
      return;
    }
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognizerRef.current = new SpeechRecognition();
    recognizerRef.current.lang = "ja-JP";
    recognizerRef.current.interimResults = true;
    recognizerRef.current.continuous = true;
    recognizerRef.current.onresult = event => {
      [...event.results].slice(event.resultIndex).forEach(result => {
        const transcript = result[0].transcript;
        if (result.isFinal) {
          setFinalText(prevState => {
            return prevState + transcript;
          });
          setTranscript("");
        } else {
          if (transcript.includes("テスト")) {
            console.log("マッチした");
          }
          setTranscript(transcript);
        }
      });
    };
  });

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
          <p>
            {finalText}
            <span style={{ color: "#aaa" }}>{transcript}</span>
          </p>
          <div id="result-div"></div>
        </Box>
        <Autocomplete
          multiple
          id="tags-filled"
          options={candidates}
          defaultValue={["テスト"]}
          freeSolo
          renderTags={(value, getTagProps) => {
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
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={() => {
                  recognizerRef.current.start();
                }}
              >
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
