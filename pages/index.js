import React, { useState, useEffect, useRef } from "react";
import Head from "../components/head";
import Container from "@material-ui/core/Container";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import Notice from "../components/notice";

const Home = () => {
  const recognizerRef = useRef();
  const inputRef = useRef();
  const [alertOpen, setAlertOpen] = useState(false);
  const [fileLoaded, setFileLoaded] = useState(false);
  const [finalText, setFinalText] = useState("");
  const [transcript, setTranscript] = useState("ボタンを押して検知開始");
  const initialTagValues = ["年収"];
  const [tagValues, setTagValues] = useState(initialTagValues);
  const [detecting, setDetecting] = useState(false);
  const candidates = ["年収", "自由", "成功"];
  const [userMusic, setUserMusic] = useState(null);
  const [userMusicName, setUserMusicName] = useState("");

  useEffect(() => {
    const music = new Audio("/static/warning01.mp3");
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("お使いのブラウザには未対応です");
      return;
    }
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognizerRef.current = new SpeechRecognition();
    recognizerRef.current.lang = "ja-JP";
    recognizerRef.current.interimResults = true;
    recognizerRef.current.continuous = true;
    recognizerRef.current.onstart = () => {
      setDetecting(true);
    };
    recognizerRef.current.onend = () => {
      setDetecting(false);
    };
    recognizerRef.current.onresult = (event) => {
      [...event.results].slice(event.resultIndex).forEach((result) => {
        const transcript = result[0].transcript;
        if (result.isFinal) {
          setFinalText((prevState) => {
            return prevState + transcript;
          });
          setTranscript("");
        } else {
          if (tagValues.some((value) => transcript.includes(value))) {
            (userMusic || music).play();
            setAlertOpen(true);
          }
          setTranscript(transcript);
        }
      });
    };
  });

  return (
    <div>
      <Head title="Home" />
      <Notice
        open={alertOpen}
        severity="error"
        onClose={() => {
          setAlertOpen(false);
        }}
      >
        自慢を検知しました
      </Notice>
      <Notice
        open={fileLoaded}
        severity="success"
        onClose={() => {
          setFileLoaded(false);
        }}
      >
        {userMusicName}を読み込みました
      </Notice>
      <Container>
        <Grid container alignItems="center" justify="center">
          <Grid item>
            <img src="/static/logo.png" height="200px" />
          </Grid>
        </Grid>
        <Box fontSize={25}>
          <p>
            {finalText}
            <span style={{ color: alertOpen ? "#f00" : "#aaa" }}>
              {transcript}
            </span>
          </p>
          <div id="result-div"></div>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={11}>
            <Autocomplete
              disabled={detecting}
              multiple
              id="tags-filled"
              options={candidates}
              freeSolo
              defaultValue={initialTagValues}
              onChange={(event, values) => {
                setTagValues(values);
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => {
                return (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="反応する単語"
                    placeholder="単語を追加 +"
                  />
                );
              }}
            />
          </Grid>
          <Grid item>
            <input
              ref={inputRef}
              accept="audio/*"
              id="file-input"
              multiple
              type="file"
              style={{ display: "none" }}
              onChange={(event) => {
                const file = event.target.files[0];
                if (!(file instanceof File)) return;
                if (file.type.indexOf("audio") === -1) {
                  alert("オーディオファイルを選択してください");
                  return;
                }
                const src = window.URL.createObjectURL(file);
                const audio = new Audio(src);
                setUserMusic(audio);
                setUserMusicName(file.name);
                setFileLoaded(true);
              }}
            />
            <label htmlFor="file-input">
              <IconButton
                color="primary"
                size="large"
                disabled={detecting}
                aria-label="upload audio"
                component="span"
              >
                <LibraryMusicIcon />
              </IconButton>
            </label>
          </Grid>
        </Grid>
        <Box m={2}>
          <Grid container alignItems="center" justify="center">
            <Grid item>
              <Button
                variant="outlined"
                disabled={detecting}
                color="secondary"
                size="large"
                onClick={() => {
                  recognizerRef.current.start();
                }}
              >
                {detecting ? "検知中..." : "検知開始"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default Home;
