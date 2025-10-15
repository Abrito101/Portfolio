
On Monday, I experienced the most realistic issue with my home lab. My girlfriend works remotely occasionally at her job, and her job uses a VPN. This is a very big conflict that I didn't consider before configuring the VPN. So when she got an error when she tried to complete her 2FA I knew there was a problem. 

I went along with my troubleshooting steps I checked the cables on my router/switch/ and access point making sure everything was connected, I made sure the internet was working on my other devices, my Desktop, phone, etc. So I knew there was an issue with the connection from my network to the companies. I was also working against time, she had 10 minutes to get online and running or else she'd have to go into the office. I quickly started my pc up and went into my opensense dashboard. I knew it was the VPN because we tested her connection on a mobile hotspot and it worked. So i went over to the VPN and disabled the VPN, turned off the gateway and paused the NAT rules. I made sure to not delete the VPN rather just suspend its services to allow my girlfriend to continue her work. This felt like a real world trial because something that I configured conflicted with the functionality of the devices on my network. Networking, and security isn't about configuring a perfect and secure network, rather about managing and constantly improving your network over time. 

So my plan to fix this is to make a seperate VLAN and WLAN that bypasses the VPN thats set on the network so instead of it going through AA Household -> Mullvad VPN -> WAN it goes Allina's Work Network -> ISP WAN.

To do that we just need to make another VLAN, like we did with "IOT" Devices we need to make an instance, we will name this instance "OPT3" 

So under Interfaces -> Devices -> VLAN we create a new VLAN by pressing the plus on the bottom left. 

Then under Interfaces -> Assignments we add a new interface, we select the interface we made OPT3 and add it to our interfaces. Then we go under interfaces -> [OPT3] and enable the interface, under IPv4 Configuration Type we check static IPV4. and then scroll down and in static ipv4 configuration we add our address. 192.168.30.1.  

next we configure our DHCP server so our VLAN can give IP addresses to my girlfriend's computer. Under Services -> ISC DHCPv4 we enable DHCP server on the OPT3 interface then set the scope, we choose 192.168.30.100-200. 

Then we create firewall rules to bypass the vpn. In Firewall -> Rules -> [OPT3] we add a new rule. In this rule our source OPT 3 will allow any traffic to any destination using the WAN_DHCP gateway. This bypasses the Mullvlad gateway we set up for our network. Then we set up a rule that blocks any traffic from OPT 3 to the LAN to isolate this network from our network. 

Now we configure our NAT rules since we do have a hybrid/manual setup and we put our interface as WAN and make the source address our OPT 3 network, and the NAT address the WAN. Now we need to configure the WLAN. 

So now we go under Omada Tplink cloud manager and create a new WLAN under Quick Config, this creates the wifi for us to connect to. We make the SSID (the name of the wifi) and then we put in the password. 

Then we create a new LAN we add the VLANs IP address subnet and DHCP settings again. Then we go back into the WLAN we made and add our LAN we created and we should be all done. Connect to the wifi and test to see if your IP is a 192.168.30.x IP
