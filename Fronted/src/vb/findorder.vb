
Public Class Find_Order
   
    Dim StrOrderNo As String
    Dim FormOK As Boolean

    Public Sub New(ByVal Type As String)

        ' This call is required by the Windows Form Designer.
        InitializeComponent()

        ' Add any initialization after the InitializeComponent() call.
        ' BS_Order.DataSource = Orders.getOrderList(Type)
        'Dim cmd As Odbc.OdbcCommand = MD.getCommand
        'With Orders.getCommand
        '    .CommandText = " SELECT o.`Order_No` FROM magodmis.order_list o WHERE o.Type=@Type ORDER BY o.`Order_Date` Desc;"
        '    .Parameters.AddWithValue("@Type", Type)
        '    .Connection.Open()
        '    Orders1.Order_List.Clear()
        '    Orders1.Order_List.Load(.ExecuteReader)
        '    .Connection.Close()
        '    .Parameters.Clear()
        'End With
        ' FormOK = True
    End Sub

   
    Private Sub OpenOrder()
        Dim strOrderNo As String = BS_Order.Current.item("Order_No")

        Dim Order As New Order(strOrderNo)
        Order.ShowDialog()
        Order.WindowState = FormWindowState.Maximized
    End Sub
    Public ReadOnly Property orderNo As String
        Get
            Return Me.MaskedTextBox1.Text
        End Get
    End Property
    Private Sub btn_Open_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_Open.Click
        Me.Close()
    End Sub
End Class



