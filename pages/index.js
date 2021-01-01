import React, { useState, useEffect, useRef } from "react";
import Head from "../components/head";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Notice from "../components/notice";
import UploadButton from "../components/uploadButton";
import TagField from "../components/tagField";
import TranscriptField from "../components/transcriptField";

const Home = () => {
  // 音声認識インスタンス
  const recognizerRef = useRef();
  // スナックバー表示
  const [alertOpen, setAlertOpen] = useState(false); // 自慢検知アラート
  const [fileLoaded, setFileLoaded] = useState(false); // ファイル読み込み完了
  // 音声認識
  const [detecting, setDetecting] = useState(false); // 音声認識ステータス
  const [finalText, setFinalText] = useState(""); // 確定された文章
  const [transcript, setTranscript] = useState("ボタンを押して検知開始"); // 認識中の文章
  // 単語検知
  const initialTagValues = ["年収"]; // デフォルト検知単語
  const candidates = ["年収", "自由", "成功"]; // 検知単語候補
  const [tagValues, setTagValues] = useState(initialTagValues); // 検知単語一覧
  // 効果音
  const music = new Audio("/static/warning01.mp3"); // デフォルト音
  const [userMusic, setUserMusic] = useState(null); // ユーザー追加音
  const [userMusicName, setUserMusicName] = useState(""); // ファイル名

  useEffect(() => {
    // NOTE: Web Speech APIが使えるブラウザか判定
    // https://developer.mozilla.org/ja/docs/Web/API/Web_Speech_API
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("お使いのブラウザには未対応です");
      return;
    }
    // NOTE: 将来的にwebkit prefixが取れる可能性があるため
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
          // 音声認識が完了して文章が確定
          setFinalText((prevState) => {
            return prevState + transcript;
          });
          setTranscript("");
        } else {
          // 音声認識の途中経過
          if (tagValues.some((value) => transcript.includes(value))) {
            // NOTE: ユーザーが効果音を追加しなければデフォルトを鳴らす
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
      <Head title="自慢ディテクター" />
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
            <img src="/static/logo.png" height="200px" alt="自慢ディテクター" />
          </Grid>
        </Grid>
        <Box fontSize={25}>
          <TranscriptField
            finalText={finalText}
            transcript={transcript}
            isMatch={alertOpen}
          />
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={11}>
            <TagField
              disabled={detecting}
              options={candidates}
              defaultValue={initialTagValues}
              label="反応する単語"
              placeholder="単語を追加 +"
              onTagChange={(values) => {
                setTagValues(values);
              }}
            />
          </Grid>
          <Grid item>
            <UploadButton
              disabled={detecting}
              fileType="audio"
              onFileChange={(file) => {
                const src = window.URL.createObjectURL(file);
                const audio = new Audio(src);
                setUserMusic(audio);
                setUserMusicName(file.name);
                setFileLoaded(true);
              }}
              onInvalidFileError={() => {
                alert("オーディオファイルを選択してください");
              }}
            />
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
