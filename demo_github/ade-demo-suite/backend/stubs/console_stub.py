# console_stub.py

import sys


def main(argv=None):
    argv = argv or sys.argv[1:]
    cmd = argv[0] if argv else "status"

    if cmd == "status":
        print("[console_stub] status: OK (demo)")
        return 0
    elif cmd == "ade-state":
        print("{\"status\": \"ok\", \"mode\": \"demo\"}")
        return 0
    elif cmd == "ade-observer-check":
        print("{\"observer\": \"ok\", \"mode\": \"demo\"}")
        return 0
    else:
        print(f"[console_stub] unknown command: {cmd}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
