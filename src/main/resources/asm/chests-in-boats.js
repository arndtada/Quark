function injectForEachInsn(method, opcode, callback) {
    var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');

    var target = ASM.findFirstInstruction(method,
        opcode);

    while (target !== null) {
        var index = method.instructions.indexOf(target);
        var indexShift = callback(target, index);

        var newIndex = method.instructions.indexOf(target);
        if (newIndex !== -1)
            index = newIndex;
        else if (typeof indexShift === 'number')
            index += indexShift;

        target = ASM.findFirstInstructionAfter(method,
            opcode,
            index + 1);
    }

    return method;
}

function initializeCoreMod() {
    return {
        'chests-do-not-control-boats': {
            'target': {
                'type': 'METHOD',
                'class': 'net.minecraft.entity.item.BoatEntity',
                'methodName': 'func_184179_bs', // getControllingPassenger
                'methodDesc': '()Lnet/minecraft/entity/Entity;'
            },
            'transformer': function(method) {
                var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');
                var Opcodes = Java.type('org.objectweb.asm.Opcodes');
                var InsnList = Java.type('org.objectweb.asm.tree.InsnList');


                return injectForEachInsn(method, Opcodes.ARETURN, function (target) {
                    var newInstructions = new InsnList();

                    newInstructions.add(ASM.buildMethodCall(
                        "vazkii/quark/base/handler/AsmHooks",
                        "ensurePassengerIsNotChest",
                        "(Lnet/minecraft/entity/Entity;)Lnet/minecraft/entity/Entity;",
                        ASM.MethodType.STATIC
                    ));

                    method.instructions.insertBefore(target, newInstructions);
                });
            }
        }
    }
}
