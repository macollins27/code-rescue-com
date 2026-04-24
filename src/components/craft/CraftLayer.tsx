import { useCallback, useEffect, useState } from "preact/hooks";
import StatusBar from "./StatusBar";
import ScrollProgress from "./ScrollProgress";
import CommandPalette from "./CommandPalette";
import Cheatsheet from "./Cheatsheet";
import LiveState from "./LiveState";
import SelectionCite from "./SelectionCite";
import PriceContextMenu from "./PriceContextMenu";
import { useKeyboard } from "./useKeyboard";
import {
  annotateAnchors,
  applyRegisterFromUrl,
  consoleBanner,
  enableCraftFlag,
  injectCaret,
} from "./injections";

export default function CraftLayer() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cheatOpen, setCheatOpen] = useState(false);

  const toggleCmd = useCallback(() => setCmdOpen((o) => !o), []);
  const toggleCheat = useCallback(() => setCheatOpen((o) => !o), []);
  const closeCmd = useCallback(() => setCmdOpen(false), []);
  const closeCheat = useCallback(() => setCheatOpen(false), []);

  useKeyboard({ onCmdK: toggleCmd, onToggleCheat: toggleCheat });

  useEffect(() => {
    applyRegisterFromUrl();
    enableCraftFlag();
    consoleBanner();
    const t = window.setTimeout(() => {
      injectCaret();
      annotateAnchors();
    }, 50);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <>
      <StatusBar onOpenCmd={() => setCmdOpen(true)} />
      <ScrollProgress />
      <LiveState />
      <SelectionCite />
      <PriceContextMenu />
      <Cheatsheet open={cheatOpen} onClose={closeCheat} />
      <CommandPalette open={cmdOpen} onClose={closeCmd} />
    </>
  );
}
