'use strict';
const nodemailer = require('nodemailer');
const url = 'http://localhost:3000';

var transporter;
nodemailer.createTestAccount((err, account) => {
  if (err) {
    return console.log(err);
  }
  // create reusable transporter object using the default SMTP transport
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: account.user, // generated ethereal user
      pass: account.pass // generated ethereal password
    }
  });
});

exports.solicitacaoAlterada = function(solicitacao_id) {

  db.solicitacoes.findOne({
    include: [{
      all: true
    }],
    where: {
      id: solicitacao_id
    }
  })
    .then(solicitacao => {
      let mailOptions = {
        from: '"UTFPR" <utfpr@example.com>',
        to: solicitacao.usuario.email,
        subject: '[Almoxarifado] Solicitacão Alterada',
        text: solicitacao.usuario.nome + ', sua solicitacao N° ' + solicitacao.id + ' foi alterada.' +
          ' Visite ' + url + '/solicitacoes/' + solicitacao.id + ' para visualizar.',
        html: '<b>' + solicitacao.usuario.nome + '</b>, sua solicitacao <b>N° ' + solicitacao.id +
          '</b> foi alterada. <a href="' + url + '/solicitacoes/' + solicitacao.id + '">' +
          ' Clique aqui</a> para visualizar.'
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      });
    });
};

exports.solicitacaoCancelada = function(solicitacao_id) {

  db.solicitacoes.findOne({
    include: [{
      all: true
    }],
    where: {
      id: solicitacao_id
    }
  })
    .then(solicitacao => {
      let mailOptions = {
        from: '"UTFPR" <utfpr@example.com>',
        to: solicitacao.usuario.email,
        subject: '[Almoxarifado] Solicitacão Alterada',
        text: solicitacao.usuario.nome + ', sua solicitacao N° ' + solicitacao.id + ' foi cancelada.' +
          ' Visite ' + url + '/solicitacoes/' + solicitacao.id + ' para visualizar.',
        html: '<b>' + solicitacao.usuario.nome + '</b>, sua solicitacao <b>N° ' + solicitacao.id +
          '</b> foi cancelada. <a href="' + url + '/solicitacoes/' + solicitacao.id + '">' +
          ' Clique aqui</a> para visualizar.'
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      });
    });
};

exports.solicitacaoIncluida = function(solicitacao_id) {

  db.solicitacoes.findOne({
    include: [{
      all: true
    }],
    where: {
      id: solicitacao_id
    }
  })
    .then(solicitacao => {
      let mailOptions = {
        from: '"UTFPR" <utfpr@example.com>',
        to: solicitacao.usuario.email,
        subject: '[Almoxarifado] Solicitacão Alterada',
        text: solicitacao.usuario.nome + ', sua solicitacao N° ' + solicitacao.id + ' foi incluída.' +
          ' Visite ' + url + '/solicitacoes/' + solicitacao.id + ' para visualizar.',
        html: '<b>' + solicitacao.usuario.nome + '</b>, sua solicitacao <b>N° ' + solicitacao.id +
          '</b> foi incluída. <a href="' + url + '/solicitacoes/' + solicitacao.id + '">' +
          ' Clique aqui</a> para visualizar.'
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      });
    });
};

exports.solicitacaoEstoque = function(solicitacao_id) {

  db.solicitacoes.findOne({
    include: [{
      all: true
    }],
    where: {
      id: solicitacao_id
    }
  })
    .then(solicitacao => {
      let mailOptions = {
        from: '"UTFPR" <utfpr@example.com>',
        to: solicitacao.usuario.email,
        subject: '[Almoxarifado] Solicitacão Alterada',
        text: solicitacao.usuario.nome + ', sua solicitacao N° ' + solicitacao.id + ' foi chegou ao estoque.' +
          ' Visite ' + url + '/solicitacoes/' + solicitacao.id + ' para visualizar.',
        html: '<b>' + solicitacao.usuario.nome + '</b>, sua solicitacao <b>N° ' + solicitacao.id +
          '</b> chegou ao estoque. <a href="' + url + '/solicitacoes/' + solicitacao.id + '">' +
          ' Clique aqui</a> para visualizar.'
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      });
    });
};