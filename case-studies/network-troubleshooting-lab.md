# Network Troubleshooting Lab

> **Updated:** Nov 2025
> **Category:** Network lab • **Tech:** Linux Lite, consumer routers, basic switching

## Overview

Short paragraph about what the lab is and why you built it.

- What problem or gap were you trying to solve?
- Why a physical lab rather than just Packet Tracer / simulators?
- How does it tie back to the kind of roles you’re aiming for?

## Goals

- Practise structured network diagnostics instead of guesswork.
- Get comfortable reading latency, jitter, and basic error patterns.
- Build repeatable scenarios for “something is slow / broken” exercises.
- Capture notes that map to interview stories (STAR-style).

## Environment

- **Primary host:** Linux Lite 6.6 on Lenovo C40-30 (Pentium 3805U, 8 GB RAM).
- **Other devices:** (e.g. Windows laptop, any extra Linux boxes).
- **Network gear:** consumer routers/switches, patch leads, any managed switch.
- **Addressing:** brief summary of typical subnets / addressing scheme.
- **Tools:** ping, traceroute, mtr, tcpdump/Wireshark, iperf3, etc.

## Lab Topology

Describe the physical / logical layout.

- Simple ASCII diagram or embed an image later.
- Separate out:
  - WAN / router to ISP.
  - Core switch (if any).
  - End hosts (Linux Lite box, etc).

## Scenarios

### Scenario 1 – Latency & Path Issues

- **Symptom:** Intermittent high latency to a remote host.
- **Checks:** local ping, gateway ping, DNS, traceroute, etc.
- **What you’re practising:** working from OSI layers up, documenting each step.

### Scenario 2 – Cable / Port Problems

- **Symptom:** Link flaps or drops to a specific device.
- **Checks:** link LEDs, `dmesg`/`journalctl`, switch port stats (if available).
- **Outcome:** being able to say “I’d swap cable/port and re-test” as a concrete flow.

### Scenario 3 – DNS / Name Resolution

- **Symptom:** Hostnames fail but IPs work.
- **Checks:** `dig`, `/etc/resolv.conf`, router DNS settings.
- **Outcome:** show you understand how DNS misconfig shows up to users.

(Add as many scenarios as you want.)

## Implementation Notes

- How you structured repo scripts/configs (if any).
- Any helper scripts (e.g. latency loggers, scenario setup scripts).
- How someone else could reproduce a basic version of the lab.

## Issues Encountered

- Hardware limitations (CPU/RAM, 100 Mbps gear, etc.).
- Router firmware annoyances, lack of OpenWrt support.
- Any weird Linux quirks you had to work around.

## Lessons Learned

- Technical lessons (e.g. reading `mtr`, interpreting traceroute, DNS quirks).
- Workflow lessons (e.g. documenting steps, having a checklist).
- Anything that changed how you think about troubleshooting.

## Next Steps

- Ideas for extending the lab (VLANs, routing protocols, firewall rules).
- How you might fold this into:
  - CCST prep,
  - helpdesk / NOC interview stories,
  - or a future home-lab blog post.
