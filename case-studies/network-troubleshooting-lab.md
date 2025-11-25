# Network Troubleshooting Lab

> **Updated:** Nov 2025
> **Category:** Network lab • **Tech:** Linux, consumer routers, basic switching

## Overview

The Network Troubleshooting Lab is a hands-on environment I built to strengthen practical diagnostic skills across Linux and small-office networks. Rather than relying solely on simulated tools like Packet Tracer, this lab recreates the kinds of unpredictable issues that appear in real environments — latency spikes, misconfigured DNS, link failures, routing inconsistencies, and service outages.

The aim was simple: become confident diagnosing real network symptoms under realistic pressure, with repeatable scenarios that directly relate to helpdesk, support, and junior NOC responsibilities.

## Goals

- Practise structured, step-by-step network diagnostics instead of guesswork.
- Get comfortable reading latency, jitter, and packet-loss patterns.
- Build reproducible “something is slow or broken” scenarios for hands-on learning.
- Strengthen skills in Linux networking tools and command-line troubleshooting.
- Capture outcomes and patterns that feed into interview examples (STAR format).

## Environment

**Primary host:** Linux Lite 6.6 on Lenovo C40-30 (Pentium 3805U, 8 GB RAM).
**Other devices:** Additional Linux or Windows machines for cross-OS testing.
**Network gear:** Consumer routers, unmanaged/managed switches, spare patch cabling.
**Addressing:** Basic IPv4 subnets (e.g., `192.168.x.x` ranges) for testing isolation.
**Tools:**
- `ping`, `mtr`, `traceroute`
- `curl` and basic HTTP checks
- Interface tools (`ip addr`, `ip link`, `nmcli`)
- `tcpdump`/Wireshark for packet inspection
- Router admin pages for DHCP/DNS checks

The environment is intentionally low-end. Slow hardware and limited switching gear actually help surface the kinds of inconsistent behaviours you see in real user networks.

## Lab Topology

A simplified view of the lab setup:

![Network Lab Topology](/assets/images/network-lab-topology.svg)



Additional routers and switches can be chained to create:

- Double-NAT scenarios
- Slow or misbehaving hops
- DNS inconsistencies
- Cable or port-specific failures

## Scenarios

Below are the core scenarios I built and documented.

---

### Scenario 1 — Latency & Path Issues

**Symptom:**
Intermittent high latency to external hosts.

**What I tested:**

- Local ping stability (`ping -c 30 <gateway>`).
- Hop analysis with `mtr` to identify where spikes occur.
- DNS vs direct-IP behaviour (`ping google.com` vs `8.8.8.8`).
- Router load and logs.

**Outcome:**
Built muscle memory for identifying whether latency is:

- On the local link
- On a LAN hop
- Starting at the router
- DNS-related
- Or genuinely external

This scenario alone improved my troubleshooting speed massively.

---

### Scenario 2 — Cable / Port Faults

**Symptom:**
Random link drops on a specific device.

**What I tested:**

- Physical link LEDs (solid/blinking vs intermittent).
- Interface logs:
  - `dmesg | grep -i link`
  - `journalctl -u NetworkManager`
- Swapping patch leads and switch ports.
- Testing negotiation speed (100/1000 Mbps issues).

**Outcome:**
Clear understanding of how faulty or low-quality cabling presents at the OS level — something extremely common in support roles.

---

### Scenario 3 — DNS / Name Resolution Failures

**Symptom:**
Hostnames fail, but IP addresses work fine.

**What I tested:**

- `dig <hostname>` and comparing to public resolvers.
- Reviewing `/etc/resolv.conf`.
- DNS settings on router and test devices.
- Latency to DNS servers.

**Outcome:**
Developed a reliable troubleshooting flow for DNS issues — a huge part of 1st-line and service-desk work.

---

### Scenario 4 — Basic Connectivity Failures

**Symptom:**
User reports “no internet”.

**What I walked through:**

- Confirmed local IP and gateway.
- Gateway reachability.
- DNS resolution.
- HTTP checks (`curl -I http://example.com`).
- NAT and DHCP information on the router.

**Outcome:**
A complete checklist for diagnosing “can’t connect” issues quickly and confidently.

---

## Implementation Notes

- Scenarios are intentionally kept small and repeatable.
- Everything is logged in a structured format (symptom → checks → outcome).
- No vendor-specific tools — the focus is fundamentals.
- Repo includes scripts for basic latency logging and interface checks.

This is deliberately the type of hands-on learning missing from purely theoretical study.

## Issues Encountered

- Low-end hardware made some behaviours inconsistent (good for learning).
- Certain routers provided poor diagnostics, forcing use of Linux tools instead.
- Some consumer switches masked packet-loss, requiring more direct host-level testing.
- Wireless interference occasionally impacted results in unexpected ways.

## Lessons Learned

- Most “network issues” are either DNS or a local-hop fault.
- mtr is vastly more informative than ping alone.
- Good troubleshooting is about eliminating layers, not guessing symptoms.
- Physical checks (cables, ports, LEDs) solve more issues than fancy tools.
- Documenting everything builds reliable interview examples.

## Next Steps

- Introduce VLANs and segmentation to make the scenarios more realistic.
- Add structured DHCP and DNS failure exercises.
- Include iperf3 for throughput testing.
- Expand notes into a short “Network Troubleshooting Playbook” for reuse.

