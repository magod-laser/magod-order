 Dim SyncInvList = From HOinv In Unit_Accounts1.unit_invoices_list, _
                            UnitInv In importUnitAccts.unit_invoices_list _
                            Where HOinv.DC_Inv_No = UnitInv.DC_Inv_No
        For Each inv In SyncInvList
            '**** Invoices Exist at both ends but details do not match
            If inv.HOinv.PymtAmtRecd <> inv.UnitInv.PymtAmtRecd _
                Or inv.HOinv.GrandTotal <> inv.UnitInv.GrandTotal _
                Or inv.HOinv.DCStatus <> inv.UnitInv.DCStatus Then
                Dim newInv As magod.AccountsDS.Unit_HO_Inv_SyncListRow _
                               = Unit_Accounts1.Unit_HO_Inv_SyncList.NewUnit_HO_Inv_SyncListRow
                With newInv
                    .DC_Inv_No = inv.HOinv.DC_Inv_No
                    .Inv_Date = inv.HOinv.Inv_Date
                    .DC_InvType = inv.HOinv.DC_InvType
                    .Inv_No = inv.HOinv.Inv_No
                    .Cust_Name = inv.HOinv.Cust_Name
                    .HO_GrandTotal = inv.HOinv.GrandTotal
                    .HO_PymtAmtRecd = inv.HOinv.PymtAmtRecd
                    .HO_DCStatus = inv.HOinv.DCStatus
                    .Unit_GrandTotal = inv.UnitInv.GrandTotal
                    .Unit_PymtAmtRecd = inv.UnitInv.PymtAmtRecd
                    .Unit_DCStatus = inv.UnitInv.DCStatus
                    .Unit_UId = inv.UnitInv.DC_Inv_No
                    .Sync_HOId = inv.UnitInv.Sync_HOId
                    .Remarks = "Value Different"
                End With