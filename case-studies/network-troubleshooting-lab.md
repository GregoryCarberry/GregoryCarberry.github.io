# Network Troubleshooting Lab

> **Updated:** Dec 2025
> **Category:** Network lab
> **Tech:** OpenWrt (BT HH5A), Cisco SG300-28, VLANs, NAT/firewall, Linux/Windows client testing

## Overview

This project is a practical network troubleshooting lab built around real hardware and real failure modes. It focuses on diagnosing multi-device connectivity problems using repeatable checks and clear evidence, rather than relying on simulated environments.

The lab is intentionally designed so that mistakes are visible and traceable (routing boundaries, VLAN separation, NAT/forwarding, management reachability), producing incidents that can be reproduced and documented.

## Current Topology

High level path:

- Virgin Media Hub in **modem mode** (management only at `192.168.100.1`)
- BT Home Hub 5A running **OpenWrt** as the **only Layer 3 device** (WAN DHCP, NAT, firewall, DHCP/DNS)
- Cisco **SG300-28** as the primary **Layer 2** switch (VLAN segmentation + switch management)

![Network Lab Topology](/assets/images/network-lab-topology.svg)

## What This Lab Demonstrates

- Separating **switching problems** from **routing/NAT problems**
- Understanding “router has internet, LAN doesn’t” patterns
- VLAN management design (and the requirement for routing or a management host in the same VLAN)
- Validating assumptions with traffic that matters (DNS + HTTP/HTTPS), not only ICMP
- Writing documentation that supports repeat testing and recovery

## Key Incident: “Router Has Internet, LAN Doesn’t”

### Symptom

- OpenWrt router could reach the internet
- Clients could reach the router
- Clients could not reach the internet (reported as “no internet”)

### Investigation (evidence-led)

Checks were run in a fixed order to avoid chasing red herrings:

1. **Layer 1/2**
   - Link up end-to-end
   - Client-to-switch-to-router connectivity verified

2. **Layer 3 basics**
   - Client addressing and default gateway validated
   - Router WAN addressing confirmed

3. **Name resolution vs raw reachability**
   - DNS resolution verified (client querying router resolver)
   - HTTP/HTTPS tested to validate real traffic paths

4. **Routing boundary**
   - Confirmed that the switch was not intended to route
   - Confirmed OpenWrt was the only device expected to NAT and forward to WAN

### Root Cause

- NAT / forwarding behaviour was not correctly applied for LAN → WAN traffic.
- Result: the router itself could originate traffic, but client traffic was not being translated/forwarded out of WAN.

### Fix

- Corrected LAN → WAN forwarding and WAN masquerading on OpenWrt
- Restarted networking/firewall cleanly
- Re-ran validation checks to confirm the end-to-end path

### Verification

- Client to router: OK
- Client DNS via router: OK
- Client HTTP/HTTPS to external sites: OK
- Traffic remained OK when traversing the SG300 (not only when directly connected)

## Supporting Design Lesson: Management VLAN Reachability

A separate fault surfaced when placing switch management into a dedicated VLAN:

- Switch management IP placed in **VLAN 99**
- Client device remained in **VLAN 1**
- With **no inter-VLAN routing**, VLAN 1 cannot reach VLAN 99 by design

This was resolved by treating VLAN 99 as an isolated management plane:
- Either move a management workstation temporarily into VLAN 99 when needed, or
- Introduce explicit routing later (kept out of scope at this stage)

## Implementation Notes

- Component documentation lives alongside configs (e.g. `configs/openwrt/hh5a-ap1`)
- Scenarios are kept small and repeatable
- The focus is on fundamentals: addressing, routing, NAT, firewalling, and VLAN behaviour

## Next Steps

- Document and archive Cisco SG300 running configuration (baseline + changes)
- Add a comparative scenario using the Zyxel GS1920-24 (GUI-driven management vs enterprise-style CLI)
- Add wireless-focused troubleshooting scenarios using:
  - Cisco AIR-SAP2602I-E-K9 access points
  - Alfa AWUS051NH v2 for client-side diagnostics and capture

