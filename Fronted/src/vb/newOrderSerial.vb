Public Class NewOrderSrl
    Private strType As String
    Private bolOK As Boolean
    Public Sub New(ByVal Type As String)

        ' This call is required by the Windows Form Designer.
        InitializeComponent()

        ' Add any initialization after the InitializeComponent() call.
        strType = Type

        setupData()
    End Sub
    Private Sub setupData()
        '****** Material
        With Me.cmb_material
            .DataSource = Orders.getMtrlCode
            .DisplayMember = "Mtrl_Code"
            .ValueMember = "Mtrl_code"
        End With

        Select Case strType
            Case "Profile"
                BS_Operation.DataSource = Orders.getProfileOperations
            Case "Service"
                BS_Operation.DataSource = Orders.getServiceOperations
            Case "Fabrication"
                BS_Operation.DataSource = Orders.getFabricationProcessList
            Case "Misc"
        End Select
        With cmb_process
            .DataSource = BS_Operation
            .DisplayMember = "Operation"
            .ValueMember = "Operation"
        End With
        '  BS_Operation.DataSource = Orders.getProfileOperations
        BS_Tolerance.DataSource = Orders.getTolerance
        BS_PkngLevel.DataSource = Orders.getPkngLevel
        With cmb_pknglevel
            .DataSource = BS_PkngLevel
            .DisplayMember = "PkngLevel"
            .ValueMember = "PkngLevel"
        End With

        BS_InspLevel.DataSource = Orders.getInspLevel
        With cmb_insplevel
            .DataSource = BS_InspLevel
            .DisplayMember = "InspLevel"
            .ValueMember = "InspLevel"
        End With

    End Sub

    Private Sub btnSave_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnSave.Click
        '**** Check for Correctness
        If Me.txt_Drawing_name.Text.Length = 0 Then
            MsgBox("Part/ Drawing Name is Mandatory")
            Exit Sub
        End If
        If Me.txt_qty.Text = 0 Then
            MsgBox("Quantity is Mandatory")
            Exit Sub
        End If
        bolOK = True
        Me.Close()
    End Sub

    Private Sub txt_qty_Validating(ByVal sender As System.Object, ByVal e As System.ComponentModel.CancelEventArgs) Handles txt_qty.Validating
        If Not IsNumeric(Me.txt_qty.Text) Then
            MsgBox("Positive Number Required")
            e.Cancel = True
            Exit Sub
        ElseIf CDbl(Me.txt_qty.Text) <= 0 Then
            MsgBox("Positive Number Required")
            e.Cancel = True
            Exit Sub
        End If
    End Sub

    Private Sub TextBox_JWPrice_Validating(ByVal sender As Object, ByVal e As System.ComponentModel.CancelEventArgs) Handles TextBox_JWPrice.Validating
        If Not IsNumeric(Me.TextBox_JWPrice.Text) Then
            MsgBox("Positive Number Required")
            e.Cancel = True
            Exit Sub
        ElseIf CDbl(Me.TextBox_JWPrice.Text) <= 0 Then
            MsgBox("Positive Number Required")
            e.Cancel = True
            Exit Sub
        End If
    End Sub

    Private Sub TextBox_MtrlPrice_Validating(ByVal sender As Object, ByVal e As System.ComponentModel.CancelEventArgs) Handles TextBox_MtrlPrice.Validating
        If Not IsNumeric(Me.TextBox_MtrlPrice.Text) Then
            MsgBox("Positive Number Required")
            e.Cancel = True
            Exit Sub
        ElseIf CDbl(Me.TextBox_MtrlPrice.Text) <= 0 Then
            MsgBox("Positive Number Required")
            e.Cancel = True
            Exit Sub
        End If
    End Sub
    Public ReadOnly Property PartName() As String
        Get
            Return Me.txt_Drawing_name.Text
        End Get
      
    End Property
    Public ReadOnly Property Material() As String
        Get
            Return cmb_material.SelectedValue
        End Get
    End Property
    Public ReadOnly Property MaterialSource() As String
        Get
            Return cmb_materialsource.SelectedItem
        End Get
    End Property
    Public ReadOnly Property Operation() As String
        Get
            Return cmb_process.SelectedValue
        End Get
    End Property
    Public ReadOnly Property Qty() As Double
        Get
            Return txt_qty.Text
        End Get
    End Property
    Public ReadOnly Property JWRate() As Decimal
        Get
            Return TextBox_JWPrice.Text
        End Get
    End Property
    Public ReadOnly Property MtrlRate() As Decimal
        Get
            Return TextBox_MtrlPrice.Text
        End Get
    End Property
    Public ReadOnly Property PkngLevel() As String
        Get
            Return cmb_pknglevel.SelectedValue
        End Get
    End Property
    Public ReadOnly Property InspLevel() As String
        Get
            Return cmb_insplevel.SelectedValue
        End Get
    End Property
    Public ReadOnly Property Save() As Boolean
        Get
            Return bolOK
        End Get
    End Property

    Private Sub NewOrderSrl_Load(sender As Object, e As EventArgs) Handles MyBase.Load

    End Sub
End Class