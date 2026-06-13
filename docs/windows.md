# Windows

V1 does not ship a DirectShow driver.

Use this path today:

```text
Phone -> LensBridge Desktop -> LensBridge OBS Output -> OBS Window Capture -> OBS Virtual Camera
```

In OBS, select **LensBridge OBS Output** as a Window Capture source. If the preview is black, try capture methods in this
order: Windows Graphics Capture, Windows 10 1903 and up, then BitBlt.

Native Windows support requires careful DirectShow or Media Foundation engineering and signing. It is not claimed as
working yet.
